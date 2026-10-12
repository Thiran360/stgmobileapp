const fs = require('fs');
let content = fs.readFileSync('src/api/index.ts', 'utf8');

if (!content.includes('submitContact')) {
    content = content.replace(
        "export const apiService = {",
        "export const apiService = {\n  submitContact: async (data: any) => {\n    const res = await fetchWithTimeout(API_ENDPOINTS.CONTACT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });\n    return res.json();\n  },"
    );
    fs.writeFileSync('src/api/index.ts', content, 'utf8');
}
console.log('Contact added to api index');
