import React, { useState } from "react";
import SignStud from "./loginStud";
import LoginStud from "./loginSeller";

function FormMain() {
    const [rotate, setRotate] = useState(false);

    return (
        <div className="outer">
            <div className={`inner ${rotate ? 'rotate' : ''}`}>
                <SignStud setRotate={setRotate} />
                <LoginStud setRotate={setRotate} />
            </div>
        </div>
    );
}

export default FormMain;
