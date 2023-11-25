
import "@/api/apiConfig";
import { Button, TextField } from "@mui/material"
import { useFormik } from "formik";
import InputNumber from "../InputNumber/InputNumber";
import * as Yup from "yup";
import { toastError, toastSuccess } from "@/provider/ToastProvider";
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation";
import { ILoginRequest } from "@/interface/auth";
import { authApi } from "@/api/authApi";
import { lcStorage } from "@/helpers/localStorage";
import { ACCESS_TOKEN, USER_LOGIN } from "@/constant/userContants";
import { useDispatch } from "react-redux";
import { DispatchType } from "@/redux/store";
import { setAuth } from "@/redux/slices/authSlice";
import { setSessionUser } from "@/helpers/jwt";

function FormLogin() {

    const dispatch: DispatchType = useDispatch()

    const router = useRouter()

    const formLogin = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string().required("Vui lòng nhập email").email("Vui lòng nhập đúng định dạng email"),
            password: Yup.string().required("Vui lòng nhập password")
        }),
        onSubmit: async (values) => {
            signIn('credentials', {
                username: values.email,
                password: values.password,
                redirect: false,
                callbackUrl: '/'
            }).then((res) => {
                // console.log(res);
                if (res?.error) return toastError("Đăng nhập không thành công")

                toastSuccess("Đăng nhập thành công")
                router.push('/')
            })


            // const loginRequest: ILoginRequest = {
            //     username: values.email,
            //     password: values.password
            // }
            // const result = await authApi.login(loginRequest)
            // console.log(result)
            // toastSuccess("Đăng nhập thành công")

            // lcStorage.set(ACCESS_TOKEN, result.data.data[ACCESS_TOKEN])
            // lcStorage.set(USER_LOGIN, result.data.data.[USER_LOGIN])

            // setSessionUser({
            //     access_token: result.data.data.access_token,
            //     refresh_token: "",
            //     user_login: result.data.data.user
            // })

            // dispatch(setAuth({
            //     userLogin: result.data.data.[USER_LOGIN],
            //     accessToken: result.data.data[ACCESS_TOKEN]
            // }))
        },
    });

    const handleAutoField = () => {
        formLogin.setValues({
            email: 'vulebaolongdeptrai@gmail.com',
            password: '123456'
        })
    }

    return (
        <div className="space-y-5">
            <TextField
                name="email"
                label="Email"
                value={formLogin.values.email}
                variant="outlined"
                fullWidth
                onChange={formLogin.handleChange}
                error={formLogin.errors.email ? true : false && formLogin.touched.email}
                helperText={formLogin.errors.email}
            />
            <InputNumber
                name="password"
                label="Mật khẩu"
                value={formLogin.values.password}
                variant="outlined"
                fullWidth
                onChange={formLogin.handleChange}
                password
                error={formLogin.errors.password ? true : false && formLogin.touched.password}
                helperText={formLogin.errors.password}
            />
            <div >
                <Button onClick={handleAutoField} type="button" variant="outlined">Tài khoản dùng thử</Button>
            </div>

            <Button onClick={formLogin.submitForm} variant="contained">Đăng nhập</Button>
        </div>
    )
}
export default FormLogin