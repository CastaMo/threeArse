<template>
    <div id="upload-photo">
        <!-- action="http://localhost:3000/api/cos/upload/photo" -->
        <!-- action="javascript: void 0;" -->
        <form
            id="upload-photo-form"
            @submit="_submitEvent($event)"
            action="javascript: void 0;"
            enctype="multipart/form-data"
            method="POST"
        >
            <input type="file" name="filefield">
            <input type="text" name="dir_path" v-model="model_dir_path">
            <input type="submit">
        </form>
        <div>{{percent}}</div>
    </div>
</template>

<script>

module.exports = {
    name: 'upload-photo',
    data() {
        return {
            $form: null,
            model_dir_path: "",
            cos: null,
            percent: ""
        };
    },
    mounted() {
        this.$form = document.getElementById("upload-photo-form");
        console.log({f: this.$form});
        this.cos = new CosCloud({
            appid: "1253262853",
            bucket: "silverjourney",
            region: "gz",
            getAppSign: function(callback) {
                $.ajax({
                    url: '/api/cos/auth/get',
                    type: "GET",
                    success: function(result) {
                        callback(result.data.sign);
                    }
                });
            },
            getAppSignOnce: function(callback) {
                $.ajax({
                    url: '/api/cos/auth/get',
                    type: "GET",
                    success: function(result) {
                        callback(result.data.sign);
                    }
                });
            }
        });
        console.log(this.cos);
    },
    methods: {
        _submitEvent(e) {
            var vm = this;
            var file = this.$form.children[0].files[0];
            var ContentLength = file.size;
            var dir_path = vm.model_dir_path || "";
            var pathname = file.name;
            if (dir_path) {
                pathname = `${dir_path}/${pathname}`;
            }
            this.cos.uploadFile(function(result) {
                console.log(arguments);
            }, function() {
                console.log(arguments);
            }, function(percent) {
                vm.percent = Number((percent * 100).toFixed(2)) + "%";
                console.log(percent);
            }, "silverjourney", pathname, file, 0);
            e.preventDefault();
            return false;
        }
    }
}
</script>

<style lang="less" scoped>

</style>
