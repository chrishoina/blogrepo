import { unstable_noStore as noStore } from 'next/cache';

interface Revenue {
  items: [
    {month: string
    revenue: number
    links: string[]}
  ];
  hasMore: boolean;
  limit: number;
  offset: number;
  count: number;
  links: string[];
  month: string;
  };

export async function fetchRevenue() {
  noStore();

  try {
    const data = await fetch("https://gf641ea24ecc468-darmok.adb.us-ashburn-1.oraclecloudapps.com/ords/ordsreact/revenue/");

    const res = await data.json();
    console.log(res.items);
    return res.items;

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}