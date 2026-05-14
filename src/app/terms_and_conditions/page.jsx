import fs from 'fs';
import path from 'path';

const TermsCondition = () => {
    let termsCondition = "";
    try {
        const filePath = path.join(process.cwd(), 'src', 'data', 'terms.html');
        termsCondition = fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        console.error("Error reading terms.txt:", error);
        termsCondition = "Failed to load terms and conditions.";
    }

    return (
        <div className="container">
            <div className="privacy-body privacy-body-mobile">
                <div dangerouslySetInnerHTML={{ __html: termsCondition }} style={{ fontFamily: 'inherit', lineHeight: '1.6' }} />
            </div>
        </div>
    );
};

export default TermsCondition;
