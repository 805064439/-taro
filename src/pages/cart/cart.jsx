import Taro, { useState, useEffect } from '@tarojs/taro'
import { AtNavBar, AtInputNumber, AtTabBar, AtButton, AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui'
import servicePath from '../../config/apiUrl'
import { View, Image } from '@tarojs/components'
import 'taro-ui/dist/style/components/flex.scss'
import { axios } from 'taro-axios'
import "../cart/cart.scss"



function ShoppingCart(props) {

    const [userName, setuserName] = useState('')
    const [cartList, setCartList] = useState([])
    const [isOpened, setIsOpened] = useState(false)
    const [deleteId, setDeleteId] = useState('')
    var Sum = 0

    const jumpToCart = () => {
        Taro.redirectTo({ url: '/pages/cart/cart' })
    }

    const getCart = (username) => {
        axios({
            method: 'post',
            url: servicePath.getCart,
            data: {
                'userName': username
            },
            withCredentials: false
        }).then(
            res => {
                setCartList(res.data.data)
            })
    }

    const jumpToGoodList = () => {
        Taro.redirectTo({ url: '../goods/goods' })
    }

    const countChange = (e, id, cartId) => {
        axios({
            method: 'post',
            url: servicePath.countChange,
            data: {
                'userName': userName,
                'change': e,
                'id': id
            },
            withCredentials: false
        }).then(
            res => {
                if (e == 0) {
                    setIsOpened(true)
                    setDeleteId(cartId)
                }
                getCart(userName)
            })
    }

    const jumpToPay = () => {
        Taro.redirectTo({ url: '../pay/pay' })
    }

    const clickClose = () => {
        setIsOpened(false)
    }

    const clickOk = () => {
        axios({
            method: 'post',
            url: servicePath.deleteCart,
            data: {
                'id': deleteId,
            },
            withCredentials: false
        }).then(
            result => {
                if (result.data.data == '删除成功') {
                    getCart(userName)
                    setIsOpened(false)
                }
            })
    }

    useEffect(() => {
        Taro.getStorage({
            key: 'userName',
            success: function (res) {
                setuserName(res.data)
                getCart(res.data)
            }
        })
    }, [])

    return (
        <View>
            <AtNavBar
                onClickLeftIcon={jumpToGoodList}
                onClickRgIconSt={jumpToCart}
                onClickRgIconNd={this.handleClick}
                color='#000'
                rightFirstIconType='shopping-cart'
                rightSecondIconType='user'
                leftIconType='chevron-left'
            >
                <h6>您好 ~ 用户{userName}</h6>
            </AtNavBar>
            <View>
                {
                    cartList.map((item, index) => {
                        return (
                            <View key={index + item} className=' my-div'>
                                <View className='at-row my-pad'>
                                    <View className='at-col my-imgdiv at-col-1 at-col--auto'>
                                        <Image
                                            className=' my-img'
                                            src={item.goodImg}
                                        />
                                    </View>
                                    <View className='at-col my-info'>
                                        <View className='my-title'>{item.goodName}</View>
                                        <View className='my-priceAndCount at-row'>
                                            <View className='my-price at-col'>{item.goodPrice}元</View>
                                            <View className='my-countDiv at-col'>
                                                <AtInputNumber
                                                    min={0}
                                                    step={1}
                                                    value={item.count}
                                                    onChange={e => countChange(e, item.id, item.cartId)}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )
                    })
                }
            </View>
            <View className='my-air'></View>
            <AtTabBar
                fixed
                tabList={[
                    { title: '商品目录', iconType: 'shopping-bag' },
                    { title: '购物车', iconType: 'shopping-cart' },
                    { title: '我的订单', iconType: 'bullet-list' }
                ]}
                current={1}
                onClick={e => {
                    if (e == 0) {
                        Taro.redirectTo({ url: '/pages/goods/goods' })
                    }
                    else if (e == 2) {
                        Taro.redirectTo({ url: '/pages/orders/orders' })
                    }
                }}
            />
            <View className='my-bottom at-row'>
                <View className='my-sum at-col'>
                    {

                        cartList.map((item, index) => {
                            Sum = Sum + item.goodPrice * item.count
                            Sum = Math.floor(Sum * 100) / 100
                        })
                    }
                    合计{Sum}元
                </View>
                <View className=' at-col'>
                    <AtButton type='primary' onClick={jumpToPay}>
                        去结算
                    </AtButton>
                </View>
            </View>
            <AtModal isOpened={isOpened}>
                <AtModalHeader>确认删除</AtModalHeader>
                <AtModalContent>
                    <View className="my-tips">是否需要在购物车中删除此商品</View>
                </AtModalContent>
                <AtModalAction>
                    <Button onClick={e => clickClose()}>取消</Button>
                    <Button onClick={e => clickOk()}>确定</Button>
                </AtModalAction>
            </AtModal>
        </View>
    )
}

export default ShoppingCart 