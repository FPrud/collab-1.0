import { AudioWaveform } from "lucide-react";

export const Logo = () => {

    return (
        <div id="logoContainer" className="flex flex-col items-center justify-center border-none">
            <h1 id="logo" className="flex flex-nowrap items-center">Co<AudioWaveform size="30" />ab'</h1>
        </div>
    );
};