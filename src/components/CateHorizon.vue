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
                  <img width="52" height="52" fill="none" src="../assets/img/icon/favorite_black.png" />
                </div>
                <div class="cate-name">
                  <label>Shopper</label>
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
export default {
  data() {
    return {
      cards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
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
      const innerWidth = this.$refs.inner.scrollWidth
      const totalCards = this.cards.length
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
.slide-horizontal {
  /* height: 300px; */
  /* padding-right: 20px; */
}

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
  /* align-items: center; */
  /* justify-content: center; */
  cursor: pointer;
/* 
  display: flex;
  flex-direction: column; */
}

:deep(.p-button-icon-only.p-button-rounded){
  height: inherit;
}

:deep(.p-button-icon-only.p-button-rounded span){
  font-size: 50px;
}

.cate-item {
  /* display: flex;
  flex-direction: column;
  width: inherit; */
}

.cate-logo {
  /* align-content: center; */
  margin: 0 auto;
}

.cate-name {
  word-wrap: break-word; 
  overflow-wrap: break-word;
}
</style>
