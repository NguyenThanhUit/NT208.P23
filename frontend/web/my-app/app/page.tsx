import List from "./List";

export default function Home() {
  return (
    <div className="bg-white min-h-screen w-full flex flex-col">
      <div className="flex-grow">
        <h3 className="text-3xl font-semibold">
          <List />
        </h3>
      </div>
    </div>
  );
}
