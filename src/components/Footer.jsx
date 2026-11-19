export default function Footer() {
  const footerLinks = [
    ['FAQ', 'Investor Relations', 'Ways to Watch', 'Corporate Information', 'Netflix Originals'],
    ['Help Center', 'Jobs', 'Terms of Use', 'Contact Us'],
    ['Account', 'Redeem Gift Cards', 'Privacy', 'Speed Test'],
    ['Media Center', 'Buy Gift Cards', 'Cookie Preferences', 'Legal Notices'],
  ];

  return (
    <footer className="mt-20 border-t border-gray-800/80 px-4 md:px-12 py-10 md:py-14 text-gray-500 text-xs md:text-sm select-none">
      <div className="max-w-6xl mx-auto space-y-6">
        <p className="hover:underline cursor-pointer">
          Questions? Call 1-800-012-3456 (Demo)
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4">
          {footerLinks.map((col, idx) => (
            <ul key={idx} className="space-y-3">
              {col.map((item) => (
                <li key={item}>
                  <a href="#" className="hover:underline hover:text-gray-400 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          ))}
        </div>

        <div>
          <button className="border border-gray-600 px-3 py-1 text-xs hover:text-white hover:border-white transition-colors cursor-pointer">
            Service Code: 839-102
          </button>
        </div>

        <p className="text-gray-600 text-[11px] pt-2">
          © 2026 Netflix Clone built with React, Vite & Tailwind CSS. Powered by TMDB.
        </p>
      </div>
    </footer>
  );
}
