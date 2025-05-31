import { getCurrentUser } from "../actions/authactions";
import SignalRProvider from "../Providers/SignalRProvider";
import Listings from "./Listings";

export default async function Home() {
    const user = await getCurrentUser();
    const notifyUrl = process.env.NOTIFY_URL;

    console.log('Server component');

    return (
        <SignalRProvider notifyUrl={notifyUrl!} user={user}>
            <div>
                <h3 className="text-3xl font-semibold mb-4"></h3>
                <Listings />
            </div>
        </SignalRProvider>
    );
}
