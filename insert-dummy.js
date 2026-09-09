const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  // Dummy Projects
  const { error: pErr } = await supabase.from('portfolio_projects').insert([
    {
      title: 'E-Commerce Redesign',
      slug: 'e-commerce-redesign',
      summary: 'A complete overhaul of an outdated e-commerce platform.',
      description: 'We rebuilt the entire frontend using Next.js and Tailwind CSS, resulting in a 40% increase in conversion rates.',
      tags: ['Next.js', 'Tailwind', 'Stripe'],
      published: true,
      sort_order: 1
    },
    {
      title: 'Real Estate Portal',
      slug: 'real-estate-portal',
      summary: 'Custom CRM and property listing platform.',
      description: 'Built a custom CRM for real estate agents with an integrated property listing portal using Supabase.',
      tags: ['React', 'Supabase', 'CRM'],
      published: true,
      sort_order: 2
    }
  ]);
  if (pErr) console.error('Projects Error:', pErr);

  // Dummy Blogs
  const { error: bErr } = await supabase.from('blog_posts').insert([
    {
      title: 'Why You Need a Client Portal',
      slug: 'why-you-need-a-client-portal',
      excerpt: 'A client portal reduces support emails by 60%.',
      content: 'A client portal reduces support emails by 60% and gives your customers a professional dashboard to track progress. Here is the technical breakdown of how we build them securely.',
      published: true,
      published_at: new Date().toISOString()
    },
    {
      title: 'Choosing the Right Database',
      slug: 'choosing-right-database',
      excerpt: 'PostgreSQL vs NoSQL? We explore real-world scenarios.',
      content: 'PostgreSQL vs NoSQL? We explore real-world scenarios to help you understand which database architecture makes sense for your applications specific scaling needs.',
      published: true,
      published_at: new Date().toISOString()
    }
  ]);
  if (bErr) console.error('Blogs Error:', bErr);

  // Dummy Services
  const { error: sErr } = await supabase.from('services').insert([
    {
      title: 'Web Development',
      slug: 'web-development',
      summary: 'Custom websites built for performance and scalability.',
      description: 'We build fast, responsive websites using the latest web technologies.',
      icon_name: 'Globe',
      published: true,
      sort_order: 1
    },
    {
      title: 'IT Consulting',
      slug: 'it-consulting',
      summary: 'Expert advice on your technology stack.',
      description: 'We provide strategic guidance on technology decisions to help your business grow.',
      icon_name: 'Laptop',
      published: true,
      sort_order: 2
    }
  ]);
  if (sErr) console.error('Services Error:', sErr);

  console.log("Dummy data inserted.");
}
run();
