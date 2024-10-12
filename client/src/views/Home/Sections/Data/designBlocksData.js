/* ALCOHOLIC BEVERAGES */
import imgBeer from "@/assets/img/alcoholic_beverages/beer.png";
import imgWine from "@/assets/img/alcoholic_beverages/wine.png";
import imgLiquor from "@/assets/img/alcoholic_beverages/liquor.png";
import imgCocktails from "@/assets/img/alcoholic_beverages/cocktails.png";

/* HOT BEVERAGES */
import imgCoffee from "@/assets/img/hot_beverages/coffee.png";
import imgTea from "@/assets/img/hot_beverages/tea.png";
import imgHotChocolate from "@/assets/img/hot_beverages/hot_chocolate.png";

/* Functional Drinks */
import imgEnergyDrinks from "@/assets/img/functional_drinks/energy_drinks.png";
import imgSportDrinks from "@/assets/img/functional_drinks/sport_drinks.png";
import imgProteinShakes from "@/assets/img/functional_drinks/protein_shakes.png";
import imgInfusion from '@/assets/img/functional_drinks/infusion_drink.png'

/* Fermented Beverages */
import imgKombucha from "@/assets/img/fermental_beverages/kombucha.png";
import imgKefir from "@/assets/img/fermental_beverages/kefir.png";
import imgKvass from '@/assets/img/fermental_beverages/kvass.png';
import imgSmoothies from '@/assets/img/fermental_beverages/smoothies.png'

export default [
  {
    heading: "Alcoholic Beverages",
    description:
      "These drinks contain ethanol (alcohol) and can be further subdivided",
    items: [
      {
        // image: `${imagesPrefix}/headers.jpg`,
        image: imgBeer,
        title: "Beer",
        subtitle: "10 Items",
        route: "home",
        pro: false
      },
      {
        // image: imgFeatures,
        image: imgWine,
        title: "Wine",
        subtitle: "14 Items",
        route: "home",
        pro: false
      },
      {
        // image: imgPricing,
        image: imgLiquor,
        title: "Spirits/Liquor",
        subtitle: "8 Items",
        route: "home",
        pro: false
      },
      {
        // image: `${imagesPrefix}/faq.jpg`,
        image: imgCocktails,
        title: "Cocktails",
        subtitle: "1 Example",
        route: "home",
        pro: false
      }
    ]
  },
  {
    heading: "Hot Beverages",
    description: "30+ Drinks typically served hot",
    items: [
      {
        // image: `${imagesPrefix}/navbars.jpg`,
        image: imgCoffee,
        title: "Coffee",
        subtitle: "4 Items",
        route: "home",
        pro: false
      },
      {
        // image: `${imagesPrefix}/nav-tabs.jpg`,
        image: imgTea,
        title: "Tea",
        subtitle: "2 Nav Tabs",
        route: "home",
        pro: false
      },
      {
        // image: imgPagination,
        image: imgHotChocolate,
        title: "Hot Chocolate",
        subtitle: "3 Items",
        route: "home",
        pro: false
      }
    ]
  },
  {
    heading: "Functional Drinks",
    description:
      "Beverages consumed for specific health benefits or energy",
    items: [
      {
        // image: `${imagesPrefix}/newsletters.jpg`,
        image: imgEnergyDrinks,
        title: "Energy Drinks",
        subtitle: "6 Items",
        route: "home",
        pro: false
      },
      {
        // image: `${imagesPrefix}/contact-sections.jpg`,
        image: imgSportDrinks,
        title: "Sports Drinks",
        subtitle: "8 Items",
        route: "home",
        pro: false
      },
      {
        // image: `${imagesPrefix}/forms.jpg`,
        image: imgProteinShakes,
        title: "Protein Shakes",
        subtitle: "3 Items",
        route: "home",
        pro: false
      },
      {
        // image: `${imagesPrefix}/inputs.jpg`,
        image: imgInfusion,
        title: "Infusions",
        subtitle: "6 Items",
        route: "home",
        pro: false
      }
    ]
  },
  {
    heading: "Fermented Beverages",
    description:
      "20+ These are non-alcoholic drinks made through fermentation",
    items: [
      {
        // image: imgAlert,
        image: imgKombucha,
        title: "Kombucha",
        subtitle: "4 Items",
        route: "home",
        pro: false
      },
      {
        // image: `${imagesPrefix}/toasts.jpg`,
        image: imgKefir,
        title: "Kefir",
        subtitle: "3 Items",
        route: "home",
        pro: false
      },
      {
        // image: imgPopover,
        image: imgKvass,
        title: "Kvass",
        subtitle: "2 Items",
        route: "home",
        pro: false
      },
      {
        // image: imgModal,
        image: imgSmoothies,
        title: "Smoothies",
        subtitle: "5 Items",
        route: "home",
        pro: false
      }
    ]
  }
  
];
