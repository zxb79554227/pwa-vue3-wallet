/* eslint-disable */
import {
    ComponentInternalInstance,
    createApp, onMounted, reactive, ref,
    defineComponent, App,
    Transition
} from "vue"
import anime from 'animejs';

import { LoadingButton } from '@/components/LoadingButton';

export function dialogConfirm(type: "info" | "warn", notify: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const method = descriptor.value;
        descriptor.value = function () {
            let app: App | null = null;
            let newNode = document.createElement('div')
            newNode.id = Math.random().toString();
            document.body.appendChild(newNode)

            const dialogComponent = {
                setup() {
                    const obj: {
                        loading: boolean,
                        maskVisible: boolean,
                        modalRef: null | Element | ComponentInternalInstance,
                    }
                        = { loading: false, modalRef: null, maskVisible: false, };
                    const state = reactive(obj)

                    const hideModal = () => {
                        state.maskVisible = false;
                        anime({
                            targets: state.modalRef,
                            scale: 0,
                            opacity: '0',
                            duration: 900,
                            complete() {
                                app?.unmount();
                                newNode.remove()
                            }
                        })
                    };

                    onMounted(() => {
                        state.maskVisible = true;
                        anime({
                            targets: state.modalRef,
                            scale: 1,
                            opacity: '1',
                        })
                    })

                    const cancel = () => {
                        hideModal();
                    }

                    return () => (
                        <>
                            <Transition name="fade">
                                {state.maskVisible && (<div
                                    class={'fadeIn fadeIn-active'}
                                    style={{
                                        position: "fixed",
                                        top: "0",
                                        right: "0",
                                        bottom: "0",
                                        left: "0",
                                        zIndex: 1000,
                                        height: "100%",
                                        backgroundColor: 'rgba(0, 0, 0, .45)'
                                    }}>
                                </div>)}
                            </Transition>
                            <div
                                ref={(ref) => { state.modalRef = ref; }}
                                class="bg-gray-50 rounded-md"
                                style={{
                                    position: 'fixed',
                                    opacity: '0',
                                    width: '520px',
                                    left: '50%',
                                    top: '30%',
                                    zIndex: 1001,
                                    transform: 'translate(-50%, -50%) scale(0)',
                                }}>
                                <div class=" text-lg font-medium border-b px-4 py-4 flex justify-between">
                                    <div>
                                        {type === "info" && "提示"}
                                        {type === "warn" && "警告"}
                                    </div>
                                    <button
                                        style={{ outline: 'none' }}
                                        onClick={cancel}
                                    >⨉</button>
                                </div>
                                <div class="px-4 py-5">{notify}</div>
                                <div class="px-4 py-3 flex justify-end border-t">
                                    <LoadingButton
                                        type={type}
                                        method={method}
                                        hideModal={hideModal}
                                    ></LoadingButton>
                                    <button
                                        class="ml-3 px-6 py-1 bg-white rounded-md border"
                                        style={{ outline: 'none' }}
                                        onClick={cancel}
                                    >取消</button>
                                </div>
                            </div>
                        </>
                    )
                }
            }
            const component = defineComponent(dialogComponent)
            app = createApp(component)
            app.mount(newNode)
        }
    };
}