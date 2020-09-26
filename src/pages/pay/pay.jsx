import Taro, { useState, useEffect } from '@tarojs/taro'
import { AtCard, AtInput, AtTextarea, AtInputNumber, AtDivider, AtIcon, AtButton } from 'taro-ui'
import servicePath from '../../config/apiUrl'
import { View, Text, Picker, Image } from '@tarojs/components'
import "../cart/cart.scss"
import "../pay/pay.scss"
import { axios } from 'taro-axios'


function Pay() {

    const [cartList, setCartList] = useState([])
    const [userName, setuserName] = useState('')
    const [addressee, setAddressee] = useState('')
    const [telephone, setTelephone] = useState('')
    const [address, setAddress] = useState('')
    const [distribution, setDistribution] = useState(['快递', '自提'])
    const [thisDistribution, setThisDistribution] = useState(distribution[0])
    const [dancyou, setDancyou] = useState([])
    const [thisDancyou, setThisDancyou] = useState('')

    var Sum = 0

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

    const countChange = (e, id) => {
        console.log('e=' + e + ',id=' + id);
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
                console.log(res.data)
                getCart(userName)
            })

    }

    const getDancyou = () => {
        Taro.request({
            url: servicePath.getDancyou
        }).then(res => {
            res.data.data.map((item, index) => {
                item.name
            })
            setDancyou(res.data.data)
            setThisDancyou(res.data.data[0].name)
        })
    }

    const moveOrder = (orderId) => {
        axios({
            method: 'post',
            url: servicePath.moveOrder,
            data: {
                'orderId': orderId,
                'userName': userName,
            },
            withCredentials: false
        }).then(
            res => {
                Taro.redirectTo({ url: '../goods/goods' })
            })
    }


    const addOrder = () => {
        axios({
            method: 'post',
            url: servicePath.addOrder,
            data: {
                'addressee': addressee,
                'telephone': telephone,
                'address': address,
                'dancyou': thisDancyou,
                'distribution': thisDistribution,
                'userName': userName,
                'sum': Sum,
            },
            withCredentials: false
        }).then(
            res => {
                getOrderId()
            })
    }
    const getOrderId = () => {
        axios({
            method: 'post',
            url: servicePath.getOrderId,
            withCredentials: false
        }).then(
            res => {
                console.log("id-----" + res.data.data[0].insertId)
                moveOrder(res.data.data[0].insertId)
            })
    }

    const submitOrder = () => {
        addOrder()
        console.log(addressee + telephone + address + thisDancyou + thisDistribution)
    }


    useEffect(() => {

        Taro.getStorage({
            key: 'userName',
            success: function (res) {
                setuserName(res.data)
                getCart(res.data)
            }
        })
        getDancyou()

    }, [])


    return (
        <View>
            <AtCard
                title='确认订单'
            >
                <AtInput
                    name='value'
                    title='收件人姓名'
                    type='text'
                    placeholder='收件人姓名'
                    value={addressee}
                    onChange={setAddressee}
                />
                <AtInput
                    name='value'
                    title='手机号码'
                    type='text'
                    placeholder='收件人电话号码'
                    value={telephone}
                    onChange={setTelephone}
                />
                <View className='my-view'>
                    <View className='my-text'><Text >收件地址</Text></View>
                    <AtTextarea
                        maxLength={200}
                        value={address}
                        onChange={setAddress}
                    />
                </View>
                <View className='my-section'>
                    <Text className='my-text2'>选择团长</Text>
                    <View>
                        <Picker mode='selector'
                            range={
                                dancyou.map((item, index) => { return item.name })
                            }
                            onChange={e => setThisDancyou(dancyou[e.detail.value].name)}>
                            <View className='at-row'>
                                <View className='my-picker at-col'>当前选择：</View>
                                <View className='my-name at-col'>{thisDancyou}</View >
                            </View>
                        </Picker>
                    </View>
                </View>
                <View className='my-section'>
                    <Text className='my-text2'>选择配送方式</Text>
                    <View>
                        <Picker mode='selector' range={distribution} onChange={e => setThisDistribution(distribution[e.detail.value])}>
                            <View className='at-row'>
                                <View className='my-picker at-col'>当前选择：</View>
                                <View className='my-name at-col'>{thisDistribution}</View >
                            </View>
                        </Picker>
                    </View>
                </View>
                <AtDivider fontColor='#2d8cf0' lineColor='#2d8cf0' >
                    <AtIcon value='shopping-cart'></AtIcon>
                </AtDivider>
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
                                                    onChange={e => countChange(e, item.id)}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )
                    })
                }
                <AtDivider fontColor='#2d8cf0' lineColor='#2d8cf0' />
            </AtCard>
            <View className='pay-bottom at-row'>
                <View className='my-sum at-col'>
                    {

                        cartList.map((item, index) => {
                            Sum = Sum + item.goodPrice * item.count
                            Sum = Math.floor(Sum * 100) / 100
                        })
                    }
                    合计:{Sum}元
                </View>
                <View className=' at-col'>
                    <AtButton
                        type='primary'
                        onClick={submitOrder}
                    >
                        提交订单
                    </AtButton>
                </View>
            </View>
            <View className='my-air'></View>
        </View >
    )

}

export default Pay