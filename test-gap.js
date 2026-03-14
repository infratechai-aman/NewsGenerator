import fs from 'fs';

async function testPdf() {
  const dummyPayload = {
    publication: {
      name: 'The Daily Chronicle',
      date: new Date().toISOString().split('T')[0],
      language: 'en',
    },
    pages: [
      {
        pageNumber: 1,
        slots: [
          {
            id: 's1',
            row: 1,
            colSpan: 4,
            assignedContent: {
              type: 'article',
              title: 'Short Lead Article',
              data: {
                headline: 'Short Lead Article',
                content: 'This is a very short article. It uses column-count: 3 but barely has enough text to fill one paragraph. We are testing if Chrome still reserves massive invisible height at the bottom of it!',
                source: 'AI',
                category: 'Test',
                imageUrl: 'https://placehold.co/600x400',
              }
            }
          },
          {
            id: 's2',
            row: 1,
            colSpan: 2,
            assignedContent: {
              type: 'article',
              title: 'Short Side Article',
              data: {
                headline: 'Short Side Article',
                content: 'Another small piece of text to test grid height bounding boxes.',
                source: 'AI',
                category: 'Test',
                imageUrl: 'https://placehold.co/600x400',
              }
            }
          },
          {
            id: 's3',
            row: 2,
            colSpan: 6,
            assignedContent: {
              type: 'article',
              title: 'Row 2 Lead Article',
              data: {
                headline: 'Row 2 Lead Article',
                content: 'This text proves that the horizontal grey line separator should immediately follow the text block above without 100mm of white space in between. It has no image to double-check the image isolation.',
                source: 'AI',
                category: 'Test',
              }
            }
          }
        ]
      }
    ]
  };

  try {
    const res = await fetch('http://localhost:3000/api/render-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dummyPayload),
    });
    
    if (res.ok) {
        const body = await res.json();
        console.log("SUCCESS!", body.url);
    } else {
        console.log("ERROR", await res.text());
    }
  } catch (e) {
    console.error(e);
  }
}

testPdf();
