import { View, Text } from '@tarojs/components'
import Taro, { useState } from '@tarojs/taro'
import { AtButton, AtCard, AtInput, AtMessage } from 'taro-ui'
import 'taro-ui/dist/style/index.scss'
import servicePath from '../../config/apiUrl'
import { axios } from 'taro-axios'
import "../message/message.scss"
function Message(props) {

  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')

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
    }
    let dataProps = {
      'userName': userName,
      'password': password
    }
    axios({
      method: 'post',
      url: servicePath.checkLogin,
      data: dataProps,
      withCredentials: false
    }).then(
      res => {
        if (res.data.data == '登录成功') {
          Taro.setStorage({
            key: 'userName',
            data: res.data.userName
          }).then(res => res)
          Taro.redirectTo({
            url: '/pages/goods/goods'
          })
        } else {
          Taro.atMessage({
            'message': '用户名密码错误',
            'type': 'error',
          })
        }
      })
  }

  const goRegister = () => {
    Taro.redirectTo({
      url: '/pages/register/register'
    })
  }

  return (
    <View className='login-view'>
      <AtCard
        title="组团购物系统"
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
        <AtMessage />
        <AtButton
          className='my-buttom'
          type='primary'
          size='normal'
          onClick={checkLogin}
        >
          登录
          </AtButton>
        <AtButton
          className='my-buttom'
          type='primary'
          size='normal'
          onClick={goRegister}
        >
          去注册
          </AtButton>
      </AtCard>
    </View>
  )
}
export default Message
