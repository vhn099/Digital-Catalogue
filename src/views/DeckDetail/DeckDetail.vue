<script setup>
import DockItem from '../../components/Dock.vue';
import SectionItem from '../../components/Section.vue'
</script>


<template>
    <DockItem></DockItem>

    <div class="flex">
        <div class="col-1">

        </div>
        <div class="col-11">
            <div class="col-12">
                <SectionItem :icon="sectionIcon" :icon_text="sectionText" line3="true"></SectionItem>
                <div class="flex flex-column">
                    <!-- https://pdfobject.com/guide/quick-start.html -->
                    <!-- https://github.com/mozilla/pdf.js#online-demo -->

                    <!-- Deck Detail -->
                    <!-- <embed
    src="http://infolab.stanford.edu/pub/papers/google.pdf#toolbar=0&navpanes=0&scrollbar=0"
    type="application/pdf"
    frameBorder="0"
    scrolling="auto"
    height="100%"
    width="100%"
></embed> -->

                    <!-- <iframe
    src="http://infolab.stanford.edu/pub/papers/google.pdf#toolbar=0&navpanes=0&scrollbar=0"
    frameBorder="0"
    scrolling="auto"
    height="100%"
    width="100%"
></iframe> -->

                    <!-- <iframe
                        src="https://drive.google.com/viewerng/viewer?embedded=true&url=http://infolab.stanford.edu/pub/papers/google.pdf#toolbar=0&scrollbar=0"
                        frameBorder="0" scrolling="auto" height="100%" width="100%"></iframe> -->
                </div>
            </div>

        </div>


    </div>

</template>



<style scoped></style>