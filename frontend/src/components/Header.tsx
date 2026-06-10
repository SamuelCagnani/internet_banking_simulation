interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <h1 className="text-xl font-semibold text-white">{title}</h1>
    </header>
  );
}
