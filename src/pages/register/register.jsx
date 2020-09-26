import { View, Text } from '@tarojs/components'
import Taro, { useState } from '@tarojs/taro'
import { AtButton, AtCard, AtInput, AtMessage } from 'taro-ui'
import 'taro-ui/dist/style/index.scss'
import servicePath from '../../config/apiUrl'
import { axios } from 'taro-axios'
import "../message/message.scss"
function Register(props) {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const checkLogin = () => {
    if (!userName) {
      Taro.atMessage({
        'message': '用户名不能为空',
        'type': 'error',
      })
      return false
    } else if (!password) {
      Taro.atMessage({
        'message': '密码不能为空',
        'type': 'error',
      })
      return false
    } else if (!confirmPassword) {
        Taro.atMessage({
          'message': '请再次输入密码',
          'type': 'error',
        })
        return false
      }
    axios({
      method: 'post',
      url: servicePath.toRegister,
      data: {
        'userName': userName,
        'password': password
      },
      withCredentials: false
    }).then(
      res => {
        if (res.data.data == '注册成功') {
          Taro.setStorage({
            key: 'userName',
            data: userName
          }).then(res => res)
          Taro.redirectTo({
            url: '/pages/goods/goods'
          })
        }
      })
  }
  return (
    <View className='login-view'>
      <AtCard
        title="注册页面"
        className='my-card'  >
        <AtInput
          title='用户名'
          name="userName"
          placeholder="请输入用户名"
          value={userName}
          onChange={setUserName}
        >
        </AtInput>

        <AtInput
          type='password'
          title='密码'
          placeholder="请输入密码"
          value={password}
          onChange={setPassword}
        >
        </AtInput>
        <AtInput
          type='password'
          title='确认密码'
          placeholder="请再次输入密码"
          value={confirmPassword}
          onChange={setConfirmPassword}
        >
        </AtInput>
        <AtMessage />
        <AtButton
          className='my-buttom'
          type='primary'
          size='normal'
          onClick={checkLogin}
        >
          登录
          </AtButton>
      </AtCard>
    </View>
  )

}
export default Register