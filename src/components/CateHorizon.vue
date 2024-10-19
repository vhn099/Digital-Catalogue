<script setup>
import Button from 'primevue/button';
</script>
<template>
  <div class="flex slide-horizontal">

    <Button icon="pi pi-angle-left" text rounded aria-label="Filter" @click="prev" />

    <div class="carousel">
      <div class="inner" ref="inner" :style="innerStyles">
        <div class="card" v-for="card in cards" :key="card">
          <!-- {{ card }} -->
          <div class="cate-item">
            <div class="cate-logo">
              <img width="52" height="52" fill="none" :src="card.icon" />
            </div>
            <div class="cate-name">
              {{ card.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <Button icon="pi pi-angle-right" text rounded aria-label="Filter" @click="next" />

    <!-- <Button icon="pi pi-star" severity="contrast" @click="next" text rounded aria-label="Star" /> -->
  </div>
</template>

<script>
const cards = [
  {
    icon: ".../../src/assets/img/icon/tshirt.png",
    name: "Apparel"
  }, {
    icon: "../../src/assets/img/icon/christmas-ball.png",
    name: "Christmas"
  }, {
    icon: "../../src/assets/img/icon/shopping.png",
    name: "Shopper Marketing"
  }];
export default {
  data() {
    return {
      cards: cards,
      innerStyles: {},
      step: '',
      transitioning: false
    }
  },

  mounted() {
    this.setStep()
    this.resetTranslate()
  },

  methods: {
    setStep() {
      const innerWidth = this.$refs.inner.scrollWidth;
      const totalCards = cards.length;
      this.step = `${innerWidth / totalCards}px`
    },

    next() {
      if (this.transitioning) return

      this.transitioning = true

      this.moveLeft()

      this.afterTransition(() => {
        const card = this.cards.shift()
        this.cards.push(card)
        this.resetTranslate()
        this.transitioning = false
      })
    },

    prev() {
      if (this.transitioning) return

      this.transitioning = true

      this.moveRight()

      this.afterTransition(() => {
        const card = this.cards.pop()
        this.cards.unshift(card)
        this.resetTranslate()
        this.transitioning = false
      })
    },

    moveLeft() {
      this.innerStyles = {
        transform: `translateX(-${this.step})
                    translateX(-${this.step})`
      }
    },

    moveRight() {
      this.innerStyles = {
        transform: `translateX(${this.step})
                    translateX(-${this.step})`
      }
    },

    afterTransition(callback) {
      const listener = () => {
        callback()
        this.$refs.inner.removeEventListener('transitionend', listener)
      }
      this.$refs.inner.addEventListener('transitionend', listener)
    },

    resetTranslate() {
      this.innerStyles = {
        transition: 'none',
        transform: `translateX(-${this.step})`
      }
    }
  }
}
</script>


<style scoped>
:deep(.p-button-icon-only.p-button-rounded) {
  height: inherit;
}

:deep(.p-button-icon-only.p-button-rounded span) {
  font-size: 50px;
}

/* 
.slide-horizontal {
  height: 300px;
  padding-right: 20px;
} */

.carousel {
  /* width: 170px; */
  overflow: hidden;
}

.inner {
  transition: transform 0.2s;
  white-space: nowrap;
  /* margin: 10px; */
}

.card {
  width: 124px;
  height: 124px;
  display: inline-flex;
  box-shadow: 0px 4px 4px 0px #00000040;
  margin: 10px;
  /* optional */
  background-color: white;
  color: black;
  border-radius: 25px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  /* 
  display: flex;
  flex-direction: column; */
}


.cate-item {
  width: 100%;
  height: 100%;
  padding: 20px 10px 10px 10px;
}

.cate-logo {
  display: grid;
  place-items: center;
  height: 60%;
}

.cate-name {
  /* display: grid;
  place-items: center; */
  /* Centers both vertically and horizontally */
  height: 40%;
  width: 100%;
  /* Full height of the outer container */
  /* border: 1px solid black; */
  /* Optional: to see the outer container */
  word-wrap: break-word;
  /* Ensures long words wrap inside the box */
  overflow-wrap: break-word;
  /* Alternative for word wrapping */
  text-align: center;
  white-space: normal !important;
  font-size: 15px;
  font-weight: 600;
}
</style>
