<script>
/*eslint-disable*/
  const validators = {
    email : new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
    url : new RegExp(/^(https?|ftp|rmtp|mms):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i),
    text : new RegExp(/^[a-zA-Z]+$/),
    digits : new RegExp(/^[\d() \.\:\-\+#]+$/),
    isodate : new RegExp(/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/)
  }
  /* eslint-enable */

export default {
  name: 'InputTag',

  props: {
    tags: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: ''
    },
    onChange: {
      type: Function
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    validate: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      newTag: ''
    }
  },

  methods: {
    focusNewTag () {
      if (this.readOnly) { return }
      this.$el.querySelector('.new-tag').focus()
    },

    addNew (tag) {
      if (tag && this.tags.indexOf(tag) === -1 && this.validateIfNeeded(tag)) {
        this.tags.push(tag)
        this.tagChange()
      }
      this.newTag = ''
    },

    validateIfNeeded (tagValue) {
      if (this.validate === '' || this.validate === undefined) {
        return true
      } else if (Object.keys(validators).indexOf(this.validate) > -1) {
        return validators[this.validate].test(tagValue)
      }
      return true
    },

    remove (index) {
      this.tags.splice(index, 1)
      this.tagChange()
    },

    removeLastTag () {
      if (this.newTag) { return }
      this.tags.pop()
      this.tagChange()
    },

    tagChange () {
      if (this.onChange) {
        // avoid passing the observer
        this.onChange(JSON.parse(JSON.stringify(this.tags)))
      }
    }
  }
}
</script>

<template>

  <div @click="focusNewTag()" v-bind:class="{'read-only': readOnly}" class="vue-input-tag-wrapper">
    <span v-for="(tag, index) in tags" v-bind:key="index" class="input-tag">
      <span>{{ tag }}</span>
      <a v-if="!readOnly" @click.prevent.stop="remove(index)" class="remove"></a>
    </span>
    <input v-if="!readOnly" v-bind:placeholder="placeholder" type="text" v-model="newTag" v-on:keydown.delete.stop="removeLastTag()" v-on:keydown.enter.188.tab.prevent.stop="addNew(newTag)" class="new-tag"/>
  </div>

</template>

<style>

  .vue-input-tag-wrapper {
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #dddee1;
    overflow: hidden;
    padding-left: 4px;
    padding-top: 0px;
    cursor: text;
    text-align: left;
    -webkit-appearance: textfield;
  }

  .vue-input-tag-wrapper .input-tag {
    background-color: #F5F3F3;
    border-radius: 3px;
    /*border: 0px solid #a5d24a;*/
    /*color: #638421;*/
    display: inline-block;
    font-size: 13px;
    font-weight: 400;
    margin-bottom: 1px;
    margin-right: 4px;
    padding: 0px;
    height: 32px;
    line-height: 1.5;
  }

  .vue-input-tag-wrapper .input-tag .remove {
    cursor: pointer;
    font-weight: bold;
    color: #4A505F;
  }

  .vue-input-tag-wrapper .input-tag .remove:hover {
    text-decoration: none;
  }

  .vue-input-tag-wrapper .input-tag .remove::before {
    content: " x";
  }

  .vue-input-tag-wrapper .new-tag {
    background: transparent;
    border: 0;
    color: #777;
    font-size: 13px;
    font-weight: 400;
    margin-top: 1px;
    outline: none;
    padding-left: 0;
    width: 100%;
    height: 32px;
    line-height: 1.5;
    border-radius: 4px;

  }

  .vue-input-tag-wrapper.read-only {
    cursor: default;
  }

</style>
