import type { NextApiRequest, NextApiResponse } from 'next';
import db from '../../lib/db';

// Define the type for a post
interface Post {
  id: number;
  title: string;
  content: string;
}

// API route to fetch posts from the MySQL database
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Query the MySQL database
    db.query('SELECT * FROM posts', (err, results) => {
      if (err) {
        console.error('Error fetching data from MySQL:', err);
        res.status(500).json({ message: 'Error fetching data' });
        return;
      }

      // Cast the results to the Post interface type
      const posts: Post[] = results as Post[];

      // Return the results as JSON
      res.status(200).json(posts);
    });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
