/*
=========================================================
* Vue Material Kit 2 - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/vue-material-kit-pro
* Copyright 2021 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

const imagesPrefix =
  "https://raw.githubusercontent.com/creativetimofficial/public-assets/master/material-design-system/presentation/sections";

import imgPricing from "@/assets/img/pricing.png";
import imgFeatures from "@/assets/img/features.png";
import imgBlogPosts from "@/assets/img/blog-posts.png";
import imgTestimonials from "@/assets/img/testimonials.png";
import imgTeam from "@/assets/img/team.png";
import imgStat from "@/assets/img/stat.png";
import imgContent from "@/assets/img/content.png";
import imgPagination from "@/assets/img/pagination.png";
import imgAlert from "@/assets/img/alerts.jpg";
import imgPopover from "@/assets/img/popovers.jpg";
import imgModal from "@/assets/img/modals.jpg";
import imgDropdowns from "@/assets/img/dropdowns.jpg";

export default [
  {
    heading: "Alcoholic Beverages",
    description:
      "These drinks contain ethanol (alcohol) and can be further subdivided",
    items: [
      {
        // image: `${imagesPrefix}/headers.jpg`,
        image: "src/views/Presentation/Sections/Data/Images/alcoholic_beverages/beer.png",
        title: "Beer",
        subtitle: "10 Items",
        route: "page-headers",
        pro: false
      },
      {
        // image: imgFeatures,
        image: "src/views/Presentation/Sections/Data/Images/alcoholic_beverages/wine.png",
        title: "Wine",
        subtitle: "14 Items",
        route: "page-features",
        pro: false
      },
      {
        // image: imgPricing,
        image: "src/views/Presentation/Sections/Data/Images/alcoholic_beverages/liquor.png",
        title: "Spirits/Liquor",
        subtitle: "8 Items",
        route: "presentation",
        pro: false
      },
      {
        // image: `${imagesPrefix}/faq.jpg`,
        image: `src/views/Presentation/Sections/Data/Images/alcoholic_beverages/cocktails.png`,
        title: "Cocktails",
        subtitle: "1 Example",
        route: "presentation",
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
        image: `src/views/Presentation/Sections/Data/Images/hot_beverages/coffee.png`,
        title: "Coffee",
        subtitle: "4 Items",
        route: "navigation-navbars",
        pro: false
      },
      {
        // image: `${imagesPrefix}/nav-tabs.jpg`,
        image: `src/views/Presentation/Sections/Data/Images/hot_beverages/tea.png`,
        title: "Tea",
        subtitle: "2 Nav Tabs",
        route: "navigation-navtabs",
        pro: false
      },
      {
        // image: imgPagination,
        image: `src/views/Presentation/Sections/Data/Images/hot_beverages/hot_chocolate.png`,
        title: "Hot Chocolate",
        subtitle: "3 Items",
        route: "navigation-pagination",
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
        image: `src/views/Presentation/Sections/Data/Images/functional_drinks/energy_drinks.png`,
        title: "Energy Drinks",
        subtitle: "6 Items",
        route: "presentation",
        pro: false
      },
      {
        // image: `${imagesPrefix}/contact-sections.jpg`,
        image: `src/views/Presentation/Sections/Data/Images/functional_drinks/sport_drinks.png`,
        title: "Sports Drinks",
        subtitle: "8 Items",
        route: "presentation",
        pro: false
      },
      {
        // image: `${imagesPrefix}/forms.jpg`,
        image: `src/views/Presentation/Sections/Data/Images/functional_drinks/protein_shakes.png`,
        title: "Protein Shakes",
        subtitle: "3 Items",
        route: "inputareas-forms",
        pro: false
      },
      {
        // image: `${imagesPrefix}/inputs.jpg`,
        image: `src/views/Presentation/Sections/Data/Images/functional_drinks/infusion_drink.png`,
        title: "Infusions",
        subtitle: "6 Items",
        route: "inputareas-inputs",
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
        image: `src/views/Presentation/Sections/Data/Images/fermental_beverages/kombucha.png`,
        title: "Kombucha",
        subtitle: "4 Items",
        route: "ac-alerts",
        pro: false
      },
      {
        // image: `${imagesPrefix}/toasts.jpg`,
        image: `src/views/Presentation/Sections/Data/Images/fermental_beverages/kefir.png`,
        title: "Kefir",
        subtitle: "3 Items",
        route: "presentation",
        pro: false
      },
      {
        // image: imgPopover,
        image: `src/views/Presentation/Sections/Data/Images/fermental_beverages/kvass.png`,
        title: "Kvass",
        subtitle: "2 Items",
        route: "ac-tooltips-popovers",
        pro: false
      },
      {
        // image: imgModal,
        image: `src/views/Presentation/Sections/Data/Images/fermental_beverages/smoothies.png`,
        title: "Smoothies",
        subtitle: "5 Items",
        route: "ac-modals",
        pro: false
      }
    ]
  }
  
];
