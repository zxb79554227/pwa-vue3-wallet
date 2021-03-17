/* eslint-disable */
import { ref, defineComponent, toRefs, CSSProperties } from "vue";
import Loading from "./Loading.vue";

interface IProps {
    method: () => Promise<any> | void;
    hideModal: () => any;
    type: 'warn' | 'info'
}

export const LoadingButton = defineComponent({
    props: {
        method: Function,
        hideModal: Function,
        type: String,
    },
    setup(props: any) {
        const confirm = () => {
            loading.value = true;
            const ret = props.method()
            if (ret instanceof Promise) {
                ret.then(() => {
                    loading.value = false;
                    props.hideModal();
                }).catch(() => {
                    loading.value = false;
                })
            } else {
                props.hideModal();
            }
        }
        const getClass = () => {
            console.log('getclass');

            let classList = `px-6 py-1 rounded-md text-white border flex justify-around items-center`
            if (loading.value) classList += ' bg-opacity-25';
            if (props.type === "info") classList += " bg-blue-500"
            else if (props.type === "warn") classList += " bg-yellow-300"
            return classList;
        }

        const getStyle = () => {
            let styles: CSSProperties = { outline: 'none', transition: 'all .3s cubic-bezier(.645,.045,.355,1)', minWidth: '0px' }
            if (loading.value) styles = { ...styles, minWidth: '300px' }
            else styles = { ...styles }
            return styles
        }

        const loading = ref(false)

        return () => (
            <button
                class={getClass()}
                style={getStyle()}
                disabled={loading.value}
                onClick={confirm}>
                { loading.value && <Loading class="mr-2" />}
                                        确认</button>
        )
    },
})