import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import { definePreset } from '@primevue/themes';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';

/* FIREBASE START */
import environment from '../firebase-config.json';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
const initial = initializeApp(environment.FIREBASE_INFO);
/* FIREBASE END */

const MyPreset = definePreset(Aura, {
    semantic: {
        transitionDuration: '0.2s',
        focusRing: {
            width: '1px',
            style: 'solid',
            color: '{primary.color}',
            offset: '2px',
            shadow: 'none'
        },
        disabledOpacity: '0.6',
        iconSize: '1rem',
        anchorGutter: '2px',
        primary: {
            50: '{purple.50}',
            100: '{purple.100}',
            200: '{purple.200}',
            300: '{purple.300}',
            400: '{purple.400}',
            500: '{purple.500}',
            600: '{purple.600}',
            700: '{purple.700}',
            800: '{purple.800}',
            900: '{purple.900}',
            950: '{purple.950}'
        },
        formField: {
            paddingX: '0.75rem',
            paddingY: '0.5rem',
            borderRadius: '{border.radius.md}',
            focusRing: {
                width: '0',
                style: 'none',
                color: 'transparent',
                offset: '0',
                shadow: 'none'
            },
            transitionDuration: '{transition.duration}'
        },
        list: {
            padding: '0.25rem 0.25rem',
            gap: '2px',
            header: {
                padding: '0.5rem 0.75rem 0.25rem 0.75rem'
            },
            option: {
                padding: '0.5rem 0.75rem',
                borderRadius: '{border.radius.sm}'
            },
            optionGroup: {
                padding: '0.5rem 0.75rem',
                fontWeight: '600'
            }
        },
        content: {
            borderRadius: '{border.radius.md}'
        },
        mask: {
            transitionDuration: '0.15s'
        },
        navigation: {
            list: {
                padding: '0.25rem 0.25rem',
                gap: '2px'
            },
            item: {
                padding: '0.5rem 0.75rem',
                borderRadius: '{border.radius.sm}',
                gap: '0.5rem'
            },
            submenuLabel: {
                padding: '0.5rem 0.75rem',
                fontWeight: '600'
            },
            submenuIcon: {
                size: '0.875rem'
            }
        },
        overlay: {
            select: {
                borderRadius: '{border.radius.md}',
                shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)'
            },
            popover: {
                borderRadius: '{border.radius.md}',
                padding: '0.75rem',
                shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)'
            },
            modal: {
                borderRadius: '{border.radius.xl}',
                padding: '1.25rem',
                shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
            },
            navigation: {
                shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)'
            }
        },
        colorScheme: {
            light: {
                surface: {
                    0: '#ffffff',
                    50: '{slate.50}',
                    100: '{slate.100}',
                    200: '{slate.200}',
                    300: '{slate.300}',
                    400: '{slate.400}',
                    500: '{slate.500}',
                    600: '{slate.600}',
                    700: '{slate.700}',
                    800: '{slate.800}',
                    900: '{slate.900}',
                    950: '{slate.950}'
                },
                primary: {
                    color: '{primary.500}',
                    contrastColor: '#ffffff',
                    hoverColor: '{primary.600}',
                    activeColor: '{primary.700}'
                },
                highlight: {
                    background: '{primary.50}',
                    focusBackground: '{primary.100}',
                    color: '{primary.700}',
                    focusColor: '{primary.800}'
                },
                mask: {
                    background: 'rgba(0,0,0,0.4)',
                    color: '{surface.200}'
                },
                formField: {
                    background: '{surface.0}',
                    disabledBackground: '{surface.200}',
                    filledBackground: '{surface.50}',
                    filledFocusBackground: '{surface.50}',
                    borderColor: '{surface.300}',
                    hoverBorderColor: '{surface.400}',
                    focusBorderColor: '{primary.color}',
                    invalidBorderColor: '{red.400}',
                    color: '{surface.700}',
                    disabledColor: '{surface.500}',
                    placeholderColor: '{surface.500}',
                    floatLabelColor: '{surface.500}',
                    floatLabelFocusColor: '{surface.500}',
                    floatLabelInvalidColor: '{red.400}',
                    iconColor: '{surface.400}',
                    shadow: '0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgba(18, 18, 23, 0.05)'
                },
                text: {
                    color: '{surface.700}',
                    hoverColor: '{surface.800}',
                    mutedColor: '{surface.500}',
                    hoverMutedColor: '{surface.600}'
                },
                content: {
                    background: '{surface.0}',
                    hoverBackground: '{surface.100}',
                    borderColor: '{surface.200}',
                    color: '{text.color}',
                    hoverColor: '{text.hover.color}'
                },
                overlay: {
                    select: {
                        background: '{surface.0}',
                        borderColor: '{surface.200}',
                        color: '{text.color}'
                    },
                    popover: {
                        background: '{surface.0}',
                        borderColor: '{surface.200}',
                        color: '{text.color}'
                    },
                    modal: {
                        background: '{surface.0}',
                        borderColor: '{surface.200}',
                        color: '{text.color}'
                    }
                },
                list: {
                    option: {
                        focusBackground: '{surface.100}',
                        selectedBackground: '{highlight.background}',
                        selectedFocusBackground: '{highlight.focus.background}',
                        color: '{text.color}',
                        focusColor: '{text.hover.color}',
                        selectedColor: '{highlight.color}',
                        selectedFocusColor: '{highlight.focus.color}',
                        icon: {
                            color: '{surface.400}',
                            focusColor: '{surface.500}'
                        }
                    },
                    optionGroup: {
                        background: 'transparent',
                        color: '{text.muted.color}'
                    }
                },
                navigation: {
                    item: {
                        focusBackground: '{surface.100}',
                        activeBackground: '{surface.100}',
                        color: '{text.color}',
                        focusColor: '{text.hover.color}',
                        activeColor: '{text.hover.color}',
                        icon: {
                            color: '{surface.400}',
                            focusColor: '{surface.500}',
                            activeColor: '{surface.500}'
                        }
                    },
                    submenuLabel: {
                        background: 'transparent',
                        color: '{text.muted.color}'
                    },
                    submenuIcon: {
                        color: '{surface.400}',
                        focusColor: '{surface.500}',
                        activeColor: '{surface.500}'
                    }
                }
            },
            dark: {
                surface: {
                    0: '#ffffff',
                    50: '{zinc.50}',
                    100: '{zinc.100}',
                    200: '{zinc.200}',
                    300: '{zinc.300}',
                    400: '{zinc.400}',
                    500: '{zinc.500}',
                    600: '{zinc.600}',
                    700: '{zinc.700}',
                    800: '{zinc.800}',
                    900: '{zinc.900}',
                    950: '{zinc.950}'
                },
                primary: {
                    color: '{primary.400}',
                    contrastColor: '{surface.900}',
                    hoverColor: '{primary.300}',
                    activeColor: '{primary.200}'
                },
                highlight: {
                    background: 'color-mix(in srgb, {primary.400}, transparent 84%)',
                    focusBackground: 'color-mix(in srgb, {primary.400}, transparent 76%)',
                    color: 'rgba(255,255,255,.87)',
                    focusColor: 'rgba(255,255,255,.87)'
                },
                mask: {
                    background: 'rgba(0,0,0,0.6)',
                    color: '{surface.200}'
                },
                formField: {
                    background: '{surface.950}',
                    disabledBackground: '{surface.700}',
                    filledBackground: '{surface.800}',
                    filledFocusBackground: '{surface.800}',
                    borderColor: '{surface.700}',
                    hoverBorderColor: '{surface.600}',
                    focusBorderColor: '{primary.color}',
                    invalidBorderColor: '{red.300}',
                    color: '{surface.0}',
                    disabledColor: '{surface.400}',
                    placeholderColor: '{surface.400}',
                    floatLabelColor: '{surface.400}',
                    floatLabelFocusColor: '{surface.400}',
                    floatLabelInvalidColor: '{red.300}',
                    iconColor: '{surface.400}',
                    shadow: '0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgba(18, 18, 23, 0.05)'
                },
                text: {
                    color: '{surface.0}',
                    hoverColor: '{surface.0}',
                    mutedColor: '{surface.400}',
                    hoverMutedColor: '{surface.300}'
                },
                content: {
                    background: '{surface.900}',
                    hoverBackground: '{surface.800}',
                    borderColor: '{surface.700}',
                    color: '{text.color}',
                    hoverColor: '{text.hover.color}'
                },
                overlay: {
                    select: {
                        background: '{surface.900}',
                        borderColor: '{surface.700}',
                        color: '{text.color}'
                    },
                    popover: {
                        background: '{surface.900}',
                        borderColor: '{surface.700}',
                        color: '{text.color}'
                    },
                    modal: {
                        background: '{surface.900}',
                        borderColor: '{surface.700}',
                        color: '{text.color}'
                    }
                },
                list: {
                    option: {
                        focusBackground: '{surface.800}',
                        selectedBackground: '{highlight.background}',
                        selectedFocusBackground: '{highlight.focus.background}',
                        color: '{text.color}',
                        focusColor: '{text.hover.color}',
                        selectedColor: '{highlight.color}',
                        selectedFocusColor: '{highlight.focus.color}',
                        icon: {
                            color: '{surface.500}',
                            focusColor: '{surface.400}'
                        }
                    },
                    optionGroup: {
                        background: 'transparent',
                        color: '{text.muted.color}'
                    }
                },
                navigation: {
                    item: {
                        focusBackground: '{surface.800}',
                        activeBackground: '{surface.800}',
                        color: '{text.color}',
                        focusColor: '{text.hover.color}',
                        activeColor: '{text.hover.color}',
                        icon: {
                            color: '{surface.500}',
                            focusColor: '{surface.400}',
                            activeColor: '{surface.400}'
                        }
                    },
                    submenuLabel: {
                        background: 'transparent',
                        color: '{text.muted.color}'
                    },
                    submenuIcon: {
                        color: '{surface.500}',
                        focusColor: '{surface.400}',
                        activeColor: '{surface.400}'
                    }
                }
            }
        }
    }
    // semantic: {
    //     primary: {
    //         50: '{indigo.50}',
    //         100: '{indigo.100}',
    //         200: '{indigo.200}',
    //         300: '{indigo.300}',
    //         400: '{indigo.400}',
    //         500: '{indigo.500}',
    //         600: '{indigo.600}',
    //         700: '{indigo.700}',
    //         800: '{indigo.800}',
    //         900: '{indigo.900}',
    //         950: '{indigo.950}'
    //     },
    //     colorScheme: {
    //         light: {
    //             primary: {
    //                 color: '{zinc.950}',
    //                 inverseColor: '#ffffff',
    //                 hoverColor: '{zinc.900}',
    //                 activeColor: '{zinc.800}'
    //             },
    //             highlight: {
    //                 background: '{zinc.950}',
    //                 focusBackground: '{zinc.700}',
    //                 color: '#ffffff',
    //                 focusColor: '#ffffff'
    //             }
    //         },
    //         dark: {
    //             primary: {
    //                 color: '{zinc.50}',
    //                 inverseColor: '{zinc.950}',
    //                 hoverColor: '{zinc.100}',
    //                 activeColor: '{zinc.200}'
    //             },
    //             highlight: {
    //                 background: 'rgba(250, 250, 250, .16)',
    //                 focusBackground: 'rgba(250, 250, 250, .24)',
    //                 color: 'rgba(255,255,255,.87)',
    //                 focusColor: 'rgba(255,255,255,.87)'
    //             }
    //         }
    //     }
    // }
});
let app = '';
app = createApp(App);
app.use(router);
app.use(PrimeVue, {
    theme: {
        preset: Aura, //MyPreset,
        options: {
            darkModeSelector: '.my-app-dark'
        }
    }
});
app.mount('#app');


// const auth = getAuth();
// onAuthStateChanged(auth, currentUser => {
//     if (!app) {
//         app = createApp(App);
//         app.use(router);
//         app.use(PrimeVue, {
//             theme: {
//                 preset: Aura, //MyPreset,
//                 options: {
//                     darkModeSelector: '.my-app-dark'
//                 }
//             }
//         });
//         app.mount('#app');
//     }
// });
