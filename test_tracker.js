const fetch = require('node-fetch');

async function test() {
  // 1. Register a test user
  const email = 'testuser_' + Date.now() + '@example.com';
  const res1 = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test User', email, password: 'password123' })
  });
  const data1 = await res1.json();
  const token = data1.token;

  if (!token) {
    console.error('Registration failed', data1);
    return;
  }
  console.log('Token acquired:', token);

  // 2. Submit a job
  const jobData = {
    title: 'Software Engineer',
    company: 'Google',
    url: 'https://example.com/job',
    description: 'We are looking for a Software Engineer with 5 years of React experience.'
  };

  const res2 = await fetch('http://localhost:5000/api/tracker', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(jobData)
  });

  const data2 = await res2.text();
  console.log('Tracker Response:', res2.status, data2);
}

test();
