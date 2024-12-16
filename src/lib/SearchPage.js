import { useAppStore } from "@/stores";
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import _ from 'lodash';
import moment from "moment";
import { CommonLib } from "./CommonLib";

export const SearchPageFirestore = {
    queryGenerator: function () {

    },
    searchDeck: async function (searchQuery, isTag) {
        try {
            const db = collection(getFirestore(), useAppStore().getDecksCollection);
            let myQuery = query(db);
            let snapshot = await getDocs(myQuery);
            let result = snapshot.docs;
            const dateFormat = useAppStore().getDateFormats.DECK;
            if (!isTag) {
                result = _.filter(result, (item) => {
                    const dataItem = item.data();
                    const title = dataItem.title.toLowerCase();
                    return title.indexOf(searchQuery.toLowerCase()) !== -1;
                });

            } else {
                let searchTag = searchQuery.substring(1);
                result = _.filter(result, item => {
                    const dataItem = item.data();
                    const tagArray = dataItem.tag || [];
                    const existed = tagArray.some(tag => tag.toLowerCase() === searchTag.toLowerCase());
                    return existed;
                });
            }
            result = _.map(result, (item) => {
                const data = item.data();
                let convertedCatalogueEdition = "";
                const momentDate = moment(new Date(data.catalogue_edition.toDate()));
                if (momentDate.isValid()) {
                    const formattedDate = momentDate.format(dateFormat);
                    convertedCatalogueEdition = CommonLib.getOnlyMonthAndYearForShortDate(formattedDate, 1, 0, "/", false);
                }
                data.catalogue_edition = convertedCatalogueEdition;
                return {
                    id: item.id,
                    ...data,
                    created: data.created ? data.created.toDate().toLocaleString() : '',
                    updated: data.updated ? data.updated.toDate().toLocaleString() : '',
                };
            });
            return result;
        } catch (error) {
            console.log(error);
            return [];
        }
    },
};