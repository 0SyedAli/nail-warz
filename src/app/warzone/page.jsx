import fs from 'fs';
import path from 'path';

const Warzone = () => {
    let warzone = "";
    try {
        const filePath = path.join(process.cwd(), 'src', 'data', 'warzone-rules.html');
        warzone = fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        console.error("Error reading warzone-rules.html:", error);
        warzone = "Failed to load warzone rules.";
    }

    return (
        <div className="container">
            <div className="privacy-body privacy-body-mobile">
                <div dangerouslySetInnerHTML={{ __html: warzone }} style={{ fontFamily: 'inherit', lineHeight: '1.6' }} />
            </div>
        </div>
    );
};

export default Warzone;
