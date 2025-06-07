
import SignalRProvider from "../Providers/SignalRProvider";
import Listings from "./Listings";

export default async function Home() {

    console.log('Server component');

    return (
        <SignalRProvider>
            <div>
                <h3 className="text-3xl font-semibold mb-4"></h3>
                <Listings />
            </div>
        </SignalRProvider>
    );
}
