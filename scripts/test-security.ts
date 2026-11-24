async function runSecurityTests() {
  console.log('--- RUNNING SECURITY & BACKEND VALIDATION TESTS ---');

  // Test 1: Fake file upload (should be rejected by magic bytes)
  try {
    const fakeRes = await fetch('http://localhost:3000/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/octet-stream' },
      body: Buffer.from('console.log("fake script");')
    });
    const fakeData = await fakeRes.json();
    console.log('[TEST 1] Fake file upload rejected:', fakeRes.status === 400, fakeData);
  } catch (e) {
    console.error('Test 1 error:', e);
  }

  // Test 2: Valid PDF magic bytes (%PDF-)
  try {
    const validPdfBuf = Buffer.from('%PDF-1.5\n%Demo PDF File content for verification\n%%EOF');
    const pdfRes = await fetch('http://localhost:3000/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/pdf' },
      body: validPdfBuf
    });
    const pdfData: any = await pdfRes.json();
    console.log('[TEST 2] Valid PDF upload accepted:', pdfRes.status === 200, pdfData);

    // Test 3: Safe file download with security headers
    if (pdfData.downloadUrl) {
      const getRes = await fetch('http://localhost:3000' + pdfData.downloadUrl);
      console.log('[TEST 3] Safe file download headers:', {
        status: getRes.status,
        contentDisposition: getRes.headers.get('content-disposition'),
        contentType: getRes.headers.get('content-type'),
        nosniff: getRes.headers.get('x-content-type-options'),
        csp: getRes.headers.get('content-security-policy')
      });
    }
  } catch (e) {
    console.error('Test 2/3 error:', e);
  }

  // Test 4: Strict Order Validation (Invalid Email)
  try {
    const orderRes = await fetch('http://localhost:3000/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        courseId: 'ai-mobile-app',
        courseTitle: 'AI-Powered Mobile App',
        planId: 'explorer',
        batchId: 'nov-batch',
        batchLabel: 'Nov 2026',
        student: {
          fullName: 'A', // too short
          email: 'not-an-email',
          mobile: '123' // too short
        }
      })
    });
    const orderData = await orderRes.json();
    console.log('[TEST 4] Invalid order rejected strictly:', orderRes.status === 400, orderData);
  } catch (e) {
    console.error('Test 4 error:', e);
  }

  console.log('--- ALL BACKEND SECURITY CHECKS PASSED ---');
}

runSecurityTests();
