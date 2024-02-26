export type Revenue = {
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
