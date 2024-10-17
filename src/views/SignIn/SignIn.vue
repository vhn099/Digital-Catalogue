<template>
    <div class="grid elements-container">
        <div class="col-2">
            
        </div>
        <div class="col-2">
            <SignInForm />
        </div>
        <div class="col-6 image-container">
        </div>
        <div class="col-2">
        </div>
    </div>
</template>

<script>
import ImageContainer from './components/ImageContainer.vue';
import SignInForm from './components/SignInForm.vue';

export default {
    setup() {

    },
    components: {
        SignInForm,
        ImageContainer
    }
}

</script>
<style>
body {
    background-color: white;
}

.elements-container {
    height: 100vh;
}

.elements-container .col-4,
.col-8 {
    padding: 0px;
}

.image-container {
    background-image: url("../../assets/img/login/mask-group.png");
    background-size: contain;
    background-repeat: no-repeat;
}
</style>