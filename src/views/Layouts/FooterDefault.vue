<script setup>
import logoDark from "@/assets/img/logo-ct-dark.png";
defineProps({
  brand: {
    type: Object,
    name: String,
    logo: String,
    route: "",
    default: () => ({
      name: "Material Kit 2",
      logo: logoDark,
      route: "/"
    })
  },
  socials: {
    type: Array,
    icon: String,
    link: String,
    default: () => [
      {
        icon: '<i class="fab fa-facebook text-lg opacity-8"></i>',
        link: "https://www.facebook.com/CreativeTim/"
      },
      {
        icon: '<i class="fab fa-twitter text-lg opacity-8"></i>',
        link: "https://twitter.com/creativetim"
      },
      {
        icon: '<i class="fab fa-dribbble text-lg opacity-8"></i>',
        link: "https://dribbble.com/creativetim"
      },
      {
        icon: '<i class="fab fa-github text-lg opacity-8"></i>',
        link: "https://github.com/creativetimofficial"
      },
      {
        icon: '<i class="fab fa-youtube text-lg opacity-8"></i>',
        link: "https://www.youtube.com/channel/UCVyTG4sCw-rOvB9oHkzZD1w"
      }
    ]
  },
  menus: {
    type: Array,
    name: String,
    items: {
      type: Array,
      name: String,
      href: String
    },
    default: () => [
      {
        name: "company",
        items: [
          {
            name: "about us",
            href: "https://www.creative-tim.com/presentation"
          },
          {
            name: "freebies",
            href: "https://www.creative-tim.com/templates/free"
          },
          {
            name: "premium tools",
            href: "https://www.creative-tim.com/templates/premium"
          },
          { name: "blog", href: "https://www.creative-tim.com/blog" }
        ]
      },
      {
        name: "resources",
        items: [
          { name: "illustrations", href: "https://iradesign.io/" },
          {
            name: "bits & snippets",
            href: "https://www.creative-tim.com/bits"
          },
          {
            name: "affiliate program",
            href: "https://www.creative-tim.com/affiliates/new"
          }
        ]
      },
      {
        name: "help & support",
        items: [
          {
            name: "contact us",
            href: "https://www.creative-tim.com/contact-us"
          },
          {
            name: "knowledge center",
            href: "https://www.creative-tim.com/knowledge-center"
          },
          {
            name: "custom development",
            href: "https://services.creative-tim.com/"
          },
          {
            name: "sponsorships",
            href: "https://www.creative-tim.com/sponsorships"
          }
        ]
      },
      {
        name: "legal",
        items: [
          {
            name: "terms & conditions",
            href: "https://www.creative-tim.com/terms"
          },
          {
            name: "privacy policy",
            href: "https://www.creative-tim.com/privacy"
          },
          {
            name: "licenses (EULA)",
            href: "https://www.creative-tim.com/license"
          }
        ]
      }
    ]
  }
});
</script>
<template>
  <footer class="footer pt-5 mt-5 pb-2 mb-5">
    <div class="container">
      <div class="row align-items-center justify-content-lg-between">
            <div class="col-12 col-md-4 my-auto">
              <div
                class="copyright text-center text-sm text-lg-start"
              >
                Power By Adm GROUP
              </div>
            </div>
            <div class="col-12 col-md-8">
              <ul
                class="nav nav-footer justify-content-center justify-content-lg-end"
              >
                <li class="nav-item">
                  <a
                    href="https://www.admgroup.com/cookie-policy"
                    class="nav-link"
                    target="_blank"
                    >Cookie Policy</a
                  >
                </li>
                <li class="nav-item">
                  <a
                    href="https://www.admgroup.com/cookie-policy"
                    class="nav-link"
                    target="_blank"
                    >Accessibility Statement</a
                  >
                </li>
                <li class="nav-item">
                  <a
                    href="https://www.admgroup.com/website-terms-of-use"
                    class="nav-link"
                    target="_blank"
                    >Terms of Use</a
                  >
                </li>
                <li class="nav-item">
                  <a
                    href="https://www.admgroup.com/website-privacy-policy"
                    class="nav-link pe-0"
                    target="_blank"
                    >Privacy Policy</a
                  >
                </li>
                <li class="nav-item">
                  <a
                    href="https://www.admgroup.com/data-security-policy"
                    class="nav-link pe-0"
                    target="_blank"
                    >Data Security Policy</a
                  >
                </li>
              </ul>
            </div>
          </div>
    </div>
  </footer>
</template>
