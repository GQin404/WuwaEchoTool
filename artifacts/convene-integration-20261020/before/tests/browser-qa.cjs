// Reusable output directory: browser acceptance must not grow the source archive.
const path=require('node:path'),os=require('node:os');
exports.output=name=>path.join(process.env.WUWA_QA_OUT||path.join(os.tmpdir(),'wuwa-v2-qa'),name);
exports.widths=defaults=>{
 if(!process.env.WUWA_QA_WIDTHS)return defaults;
 const widths=process.env.WUWA_QA_WIDTHS.split(',').map(Number);
 if(!widths.length||widths.some(n=>!Number.isInteger(n)||n<320||n>3840))throw Error('Invalid WUWA_QA_WIDTHS');
 return [...new Set(widths)];
};
// 按真实展开状态操作，兼容详细分析默认展开和用户收合后的会话。
exports.openDetails=async(page,selector)=>{const details=page.locator(selector);if(!await details.evaluate(e=>e.open))await details.locator('summary').click();};
