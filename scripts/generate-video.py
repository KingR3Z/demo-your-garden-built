#!/usr/bin/env python3
"""
Generate cinematic AI video using Kie API (Kling 3.0) or Google Veo 2.

Usage:
  # Text-to-video
  python3 generate-video.py --prompt "Slow drone over English garden" --output cinematic.mp4

  # Image-to-video with start frame
  python3 generate-video.py --start assembled.jpg --prompt "Garden elements gently float apart" --output exploded.mp4

  # Use Veo 2
  python3 generate-video.py --provider veo --prompt "Garden flyover" --output garden.mp4
"""

import argparse
import base64
import json
import os
import sys
import time
import requests

KIE_API_KEY = os.environ.get("KIE_API_KEY", "")
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY", "")

if not KIE_API_KEY and not GOOGLE_API_KEY:
    print("ERROR: Set KIE_API_KEY or GOOGLE_API_KEY environment variable")
    print("  export KIE_API_KEY=your_key_here")
    print("  export GOOGLE_API_KEY=your_key_here")
    sys.exit(1)

KIE_BASE = "https://api.kie.ai/api/v1"


def upload_image_to_kie(image_path: str) -> str:
    """Upload image to Kie and return the URL."""
    # For now, we'll use base64 inline if Kie supports it,
    # or host temporarily. Most video APIs accept URLs.
    # Kie elements need URLs, so we'll use a temporary host.
    print(f"  Note: Image {image_path} needs to be accessible via URL.")
    print(f"  Upload to a public URL first, or use the Kie file upload API.")
    return image_path


def generate_with_kie(prompt: str, start_image: str = None, end_image: str = None,
                      duration: int = 5, output: str = "output.mp4"):
    """Generate video using Kie API (Kling 3.0)."""
    print(f"Generating video with Kling 3.0 via Kie API...")
    print(f"  Prompt: {prompt[:80]}...")
    print(f"  Duration: {duration}s")

    headers = {
        "Authorization": f"Bearer {KIE_API_KEY}",
        "Content-Type": "application/json",
    }

    body = {
        "model": "kling-3.0/video",
        "input": {
            "prompt": prompt,
            "duration": str(duration),
            "aspect_ratio": "16:9",
            "mode": "pro",
            "sound": False,
            "multi_shots": False,
        },
    }

    # Add start/end frames as elements if provided
    if start_image or end_image:
        elements = []
        if start_image:
            # If it's a local file, we need it as a URL
            if start_image.startswith("http"):
                elements.append({
                    "name": "start_scene",
                    "description": "Starting frame of the animation",
                    "element_input_urls": [start_image],
                })
            else:
                print(f"  WARNING: Start image must be a URL. Local file: {start_image}")
                print(f"  Upload to Vercel/Imgur first, then pass the URL.")

        if end_image:
            if end_image.startswith("http"):
                elements.append({
                    "name": "end_scene",
                    "description": "Ending frame of the animation",
                    "element_input_urls": [end_image],
                })

        if elements:
            body["input"]["kling_elements"] = elements
            # Reference elements in prompt
            element_refs = " ".join([f"@{e['name']}" for e in elements])
            body["input"]["prompt"] = f"{prompt}. Reference: {element_refs}"

    # If we have image URLs directly (simpler approach)
    if start_image and start_image.startswith("http"):
        body["input"]["image_urls"] = [start_image]
        if end_image and end_image.startswith("http"):
            body["input"]["image_urls"].append(end_image)

    # Submit generation request
    print(f"  Submitting to Kie API...")
    r = requests.post(f"{KIE_BASE}/jobs/createTask", headers=headers, json=body, timeout=30)

    if r.status_code != 200:
        print(f"ERROR: API returned {r.status_code}: {r.text}")
        sys.exit(1)

    result = r.json()
    if result.get("code") != 200:
        print(f"ERROR: API error: {json.dumps(result, indent=2)}")
        sys.exit(1)

    task_id = result.get("data", {}).get("taskId")
    if not task_id:
        print(f"ERROR: No taskId in response: {json.dumps(result, indent=2)}")
        sys.exit(1)

    print(f"  Task ID: {task_id}")
    print(f"  Polling for completion...")

    # Poll for completion
    for attempt in range(180):  # 15 minutes max
        time.sleep(5)

        try:
            status_r = requests.get(
                f"{KIE_BASE}/jobs/recordInfo",
                params={"taskId": task_id},
                headers=headers,
                timeout=15,
            )
        except requests.exceptions.RequestException:
            continue

        if status_r.status_code != 200:
            continue

        status = status_r.json()
        state = status.get("data", {}).get("state", "")
        progress = status.get("data", {}).get("progress", 0)

        if state == "success":
            result_json_str = status.get("data", {}).get("resultJson", "{}")
            try:
                result_data = json.loads(result_json_str)
            except json.JSONDecodeError:
                result_data = {}

            video_urls = result_data.get("resultUrls", [])

            if video_urls:
                video_url = video_urls[0]
                print(f"  Downloading video from {video_url[:60]}...")
                video_data = requests.get(video_url, timeout=120)
                with open(output, "wb") as f:
                    f.write(video_data.content)
                size_mb = len(video_data.content) / 1024 / 1024
                print(f"  Saved: {output} ({size_mb:.1f}MB)")
                return output
            else:
                print(f"  WARNING: Success but no video URLs in resultJson: {result_json_str[:200]}")
                sys.exit(1)

        elif state in ("fail", "failed", "error"):
            fail_msg = status.get("data", {}).get("failMsg", "Unknown error")
            print(f"  ERROR: Generation failed: {fail_msg}")
            sys.exit(1)

        if attempt % 6 == 0:
            print(f"  Generating... ({attempt * 5}s elapsed, state: {state}, progress: {progress}%)")

    print("ERROR: Timed out after 15 minutes")
    sys.exit(1)


def generate_with_veo(prompt: str, output: str = "output.mp4"):
    """Generate video using Google Veo 2 via Gemini API."""
    print(f"Generating video with Veo 2 via Gemini API...")
    print(f"  Prompt: {prompt[:80]}...")

    url = "https://generativelanguage.googleapis.com/v1beta/models/veo-2.0-generate-001:predictLongRunning"

    headers = {
        "Content-Type": "application/json",
        "x-goog-api-key": GOOGLE_API_KEY,
    }

    body = {
        "instances": [{"prompt": prompt}],
        "parameters": {
            "aspectRatio": "16:9",
            "sampleCount": 1,
            "durationSeconds": 8,
            "personGeneration": "dont_allow",
        },
    }

    r = requests.post(url, headers=headers, json=body, timeout=30)

    if r.status_code != 200:
        print(f"ERROR: Veo API returned {r.status_code}: {r.text[:300]}")
        sys.exit(1)

    result = r.json()
    operation_name = result.get("name")

    if not operation_name:
        print(f"ERROR: No operation name: {json.dumps(result, indent=2)[:300]}")
        sys.exit(1)

    print(f"  Operation: {operation_name}")
    print(f"  Polling for completion...")

    for attempt in range(120):
        time.sleep(5)

        try:
            status_r = requests.get(
                f"https://generativelanguage.googleapis.com/v1beta/{operation_name}",
                headers={"x-goog-api-key": GOOGLE_API_KEY},
                timeout=15,
            )
        except requests.exceptions.RequestException:
            continue

        if status_r.status_code != 200:
            continue

        status = status_r.json()

        if status.get("done"):
            videos = status.get("response", {}).get("generatedSamples", [])
            if videos:
                video_b64 = videos[0].get("video", {}).get("bytesBase64Encoded")
                if video_b64:
                    with open(output, "wb") as f:
                        f.write(base64.b64decode(video_b64))
                    print(f"  Saved: {output}")
                    return output

                video_uri = videos[0].get("video", {}).get("uri")
                if video_uri:
                    dl = requests.get(video_uri, timeout=120)
                    with open(output, "wb") as f:
                        f.write(dl.content)
                    print(f"  Saved: {output} ({len(dl.content) / 1024 / 1024:.1f}MB)")
                    return output

            print(f"  WARNING: Done but no video found")
            sys.exit(1)

        if attempt % 6 == 0:
            print(f"  Generating... ({attempt * 5}s elapsed)")

    print("ERROR: Timed out after 10 minutes")
    sys.exit(1)


def main():
    parser = argparse.ArgumentParser(description="Generate cinematic AI video")
    parser.add_argument("--prompt", required=True, help="Video generation prompt")
    parser.add_argument("--start", help="Start frame image URL or path")
    parser.add_argument("--end", help="End frame image URL or path")
    parser.add_argument("--output", default="cinematic.mp4", help="Output MP4 path")
    parser.add_argument("--duration", type=int, default=5, help="Duration in seconds (Kling only)")
    parser.add_argument("--provider", choices=["kling", "veo"], default="kling", help="AI video provider")
    args = parser.parse_args()

    if args.provider == "veo":
        generate_with_veo(args.prompt, args.output)
    else:
        generate_with_kie(args.prompt, args.start, args.end, args.duration, args.output)

    print(f"\nNext step: Extract frames with:")
    print(f"  ./scripts/video-to-webp-frames.sh {args.output} public/frames 30 75")


if __name__ == "__main__":
    main()
