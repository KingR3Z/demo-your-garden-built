import { client } from "@/config/client";

export interface Review {
  id: number;
  name: string;
  date: string;
  rating: 5;
  text: string;
}

export const reviewsSummary = {
  totalReviews: 8,
  averageRating: 5.0,
  fiveStarPercentage: 100,
  googleReviewUrl: "#",
};

export const reviews: Review[] = [
  {
    id: 1,
    name: "Lewis Brown",
    date: "4 years ago",
    rating: 5,
    text: "Having recently moved house, I've had many things to organise. Thankfully U & W were recommended to me and I could not be happier with the stress free and professional service. They have managed to transform my new garden exactly the way I imagined. The work was to a very high standard and was not overpriced.",
  },
  {
    id: 2,
    name: "Hasan Hussain",
    date: "4 years ago",
    rating: 5,
    text: "We just used them to clear the garden and they worked tirelessly until the work was done. I couldn't believe what they had achieved. They were polite and helpful. I absolutely wouldn't hesitate to recommend them.",
  },
  {
    id: 3,
    name: "Cerys Davies",
    date: "a year ago",
    rating: 5,
    text: "Excellent service. Very professional, respectful and done what he said for the agreed price. Fantastic job. I would definitely recommend this company to anyone needing work done to their garden. Top class.",
  },
  {
    id: 4,
    name: "Jak Delicate",
    date: "4 years ago",
    rating: 5,
    text: "Fantastic service and they've completely transformed my garden. So happy with it and all done in time for the good weather. Would 100% recommend and will be using them again.",
  },
  {
    id: 5,
    name: "Ahmad Jawad",
    date: "4 years ago",
    rating: 5,
    text: "Fantastic service by U & W they done my whole garden, my garden needed a lot of work they did everything and were very polite easy to deal with, recommend them highly.",
  },
  {
    id: 6,
    name: "Stephanie Raby",
    date: "4 years ago",
    rating: 5,
    text: "The guys did a great job with my garden. I needed my grass cut and my trees and shrubs cut back. They were very polite and tidy. Will definitely be calling them back.",
  },
  {
    id: 7,
    name: "Russell Crane",
    date: "4 years ago",
    rating: 5,
    text: "I am extremely impressed with what they have done so far. They offered to clear the rest of the waste from the garden too. These guys are very professional.",
  },
];
