export type PublicationSite = {
  id: string;
  publication: string;
  website: string;
  da: number;
  nicheAccepted: string;
  tat: string;
  type: string;
  price: number;
  priceLabel: string;
  doFollow: boolean;
  sponsored: boolean;
  traffic: string;
};

export const publicationSites: PublicationSite[] = [
  { id: "medium", publication: "Medium", website: "medium.com", da: 95, nicheAccepted: "News, CBD, Crypto, Gambling", tat: "24 hours", type: "Feature", price: 470, priceLabel: "$470", doFollow: false, sponsored: false, traffic: "14M" },
  { id: "yahoo-1", publication: "Yahoo", website: "yahoo.com", da: 95, nicheAccepted: "News", tat: "3-4 Weeks", type: "Feature (Content Based Section)", price: 2300, priceLabel: "$2,300", doFollow: false, sponsored: false, traffic: "250M" },
  { id: "usatoday-1", publication: "USA Today", website: "usatoday.com", da: 94, nicheAccepted: "News, Real Estate, Business, Tech, Lifestyle, Entertainment, Crypto", tat: "3-4 Weeks", type: "Feature", price: 3299, priceLabel: "$3,299", doFollow: false, sponsored: false, traffic: "49M" },
  { id: "usatoday-2", publication: "USA Today", website: "usatoday.com", da: 94, nicheAccepted: "News, Real Estate, Business, Tech, Lifestyle, Entertainment, Crypto", tat: "3-4 Weeks", type: "Feature", price: 5290, priceLabel: "$5,290", doFollow: true, sponsored: false, traffic: "49M" },
  { id: "bi-africa", publication: "Business Insider (Africa)", website: "africa.businessinsider.com", da: 94, nicheAccepted: "News, Business, Lifestyle, CBD, Crypto, Gambling, Adult", tat: "1 Week", type: "Feature", price: 1500, priceLabel: "$1,500", doFollow: true, sponsored: false, traffic: "16M" },
  { id: "bi-yahoo", publication: "Business Insider/Yahoo", website: "businessinsider.com/yahoo.com", da: 94, nicheAccepted: "Business, CBD, Crypto", tat: "5-7 Days", type: "Press Release", price: 1500, priceLabel: "$1,500", doFollow: false, sponsored: true, traffic: "299K" },
  { id: "msn", publication: "MSN", website: "msn.com", da: 94, nicheAccepted: "News", tat: "1 Week", type: "Feature (Index - Maybe)", price: 999, priceLabel: "$999", doFollow: true, sponsored: false, traffic: "18M" },
  { id: "dailymail", publication: "Daily Mail (UK)", website: "dailymail.co.uk", da: 94, nicheAccepted: "News, Lifestyle, Entertainment, UK, Adult, CBD, Crypto", tat: "2-3 Weeks", type: "Feature", price: 3299, priceLabel: "$3,299", doFollow: false, sponsored: false, traffic: "28M" },
  { id: "bi-pr", publication: "Business Insider", website: "businessinsider.com", da: 94, nicheAccepted: "News", tat: "1-2 Weeks", type: "Press Release", price: 1250, priceLabel: "$1,250", doFollow: false, sponsored: false, traffic: "10M" },
  { id: "reuters", publication: "Reuters", website: "reuters.com", da: 94, nicheAccepted: "News", tat: "2-3 Weeks", type: "Press Release", price: 2399, priceLabel: "$2,399", doFollow: false, sponsored: false, traffic: "15M" },
  { id: "independent", publication: "The Independent (UK)", website: "independent.co.uk", da: 94, nicheAccepted: "News, UK, CBD, Crypto", tat: "1-2 Weeks", type: "Feature", price: 3050, priceLabel: "$3,050", doFollow: false, sponsored: true, traffic: "13M" },
  { id: "time", publication: "Time", website: "time.com", da: 94, nicheAccepted: "News", tat: "3-4 Weeks", type: "Feature", price: 8900, priceLabel: "$8,900", doFollow: false, sponsored: false, traffic: "5M" },
  { id: "africa-time", publication: "Africa Time", website: "africa.time.com", da: 94, nicheAccepted: "News", tat: "3-4 Weeks", type: "Feature", price: 2895, priceLabel: "$2,895", doFollow: true, sponsored: false, traffic: "5M" },
  { id: "bi-markets", publication: "Business Insider", website: "markets.businessinsider.com", da: 94, nicheAccepted: "News, Business, Tech, CBD, Crypto", tat: "5-7 Days", type: "Press Release", price: 1699, priceLabel: "$1,699", doFollow: false, sponsored: false, traffic: "299K" },
  { id: "latimes", publication: "LA Times", website: "latimes.com", da: 94, nicheAccepted: "News, CBD, Crypto", tat: "2-4 Weeks", type: "Feature", price: 2915, priceLabel: "$2,915", doFollow: false, sponsored: true, traffic: "8.5M" },
  { id: "hindustan", publication: "Hindustan Times", website: "hindustantimes.com", da: 93, nicheAccepted: "News, Business, India", tat: "2-3 Weeks", type: "Feature", price: 1805, priceLabel: "$1,805", doFollow: false, sponsored: true, traffic: "8.3M" },
  { id: "mashable-nl", publication: "Mashable (NL)", website: "nl.mashable.com", da: 93, nicheAccepted: "Business, Tech, Entertainment, CBD, Crypto, Gambling", tat: "1-2 Weeks", type: "Feature", price: 2150, priceLabel: "$2,150", doFollow: true, sponsored: false, traffic: "10.2M" },
  { id: "nydn", publication: "NY Daily News", website: "nydailynews.com", da: 93, nicheAccepted: "News, Business, Entertainment, Sports, CBD, Crypto, Gambling", tat: "5-7 Days", type: "Feature (Index - No)", price: 2080, priceLabel: "$2,080", doFollow: false, sponsored: true, traffic: "2.3M" },
  { id: "tc-pr", publication: "Tech Crunch", website: "techcrunch.com", da: 93, nicheAccepted: "Tech, Crypto", tat: "1-2 Weeks", type: "Press Release", price: 8850, priceLabel: "$8,850", doFollow: false, sponsored: true, traffic: "1.8M" },
  { id: "tc-feature", publication: "Tech Crunch", website: "techcrunch.com", da: 93, nicheAccepted: "Tech, Crypto", tat: "1-2 Weeks", type: "Feature", price: 35500, priceLabel: "$35,500", doFollow: false, sponsored: true, traffic: "1.8M" },
  { id: "evening-standard", publication: "Evening Standard (UK)", website: "standard.co.uk", da: 93, nicheAccepted: "News", tat: "1-2 Weeks", type: "Feature", price: 2990, priceLabel: "$2,990", doFollow: false, sponsored: true, traffic: "570K" },
  { id: "wired", publication: "Wired", website: "wired.com", da: 93, nicheAccepted: "News, Tech, Business", tat: "2-3 Weeks", type: "Feature (Index - No)", price: 2999, priceLabel: "$2,999", doFollow: false, sponsored: false, traffic: "2.9M" },
  { id: "nypost", publication: "NY Post", website: "nypost.com", da: 93, nicheAccepted: "News", tat: "2-3 Weeks", type: "Feature", price: 4940, priceLabel: "$4,940", doFollow: false, sponsored: false, traffic: "22M" },
  { id: "variety", publication: "Variety", website: "variety.com", da: 93, nicheAccepted: "Lifestyle, Fashion, Entertainment", tat: "3-4 Weeks", type: "Feature", price: 15499, priceLabel: "$15,499", doFollow: false, sponsored: false, traffic: "11M" },
  { id: "sourceforge", publication: "Source Forge (Social Included)", website: "sourceforge.net", da: 93, nicheAccepted: "News, Social Included", tat: "1-2 Weeks", type: "Feature", price: 3899, priceLabel: "$3,899", doFollow: true, sponsored: false, traffic: "750K" },
  { id: "ign-de", publication: "IGN (Germany)", website: "de.ign.com", da: 93, nicheAccepted: "Games, Tech, Entertainment, CBD, Crypto, Gambling", tat: "2 Weeks", type: "Feature", price: 3500, priceLabel: "$3,500", doFollow: true, sponsored: true, traffic: "18M" },
  { id: "ign-nordic", publication: "IGN (Nordic)", website: "nordic.ign.com", da: 93, nicheAccepted: "Games, Tech, Entertainment, CBD, Crypto, Gambling", tat: "2 Weeks", type: "Feature", price: 3100, priceLabel: "$3,100", doFollow: true, sponsored: true, traffic: "18M" },
  { id: "hollywood-reporter", publication: "The Hollywood Repoter", website: "hollywoodreporter.com", da: 93, nicheAccepted: "News, Lifestyle, Entertainment, CBD", tat: "2 Weeks", type: "Feature", price: 15499, priceLabel: "$15,499", doFollow: false, sponsored: false, traffic: "7.4M" },
  { id: "chicago-tribune", publication: "Chicago Tribune", website: "chicagotribune.com", da: 92, nicheAccepted: "News, Lifestyle, Real Estate, Entertainment, CBD, Crypto, Gambling", tat: "5-7 Days", type: "Feature (Index - No)", price: 2150, priceLabel: "$2,150", doFollow: false, sponsored: true, traffic: "2.1M" },
];

export const publicationTypes = [...new Set(publicationSites.map((s) => s.type))].sort();

export function formatYesNo(value: boolean): "Y" | "N" {
  return value ? "Y" : "N";
}
