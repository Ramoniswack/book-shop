'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import MainLayout from '@/layouts/MainLayout'
import { ArrowLeft, Truck, Store, Info, Plus, MapPin, Edit2, Trash2 } from 'lucide-react'
import { useCurrency } from '@/contexts/CurrencyContext'
import { useCart } from '@/contexts/CartContext'
import { isAuthenticated, getUser } from '@/utils/auth'
import { createOrder } from '@/utils/order'
import { getAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress, Address } from '@/utils/address'
import AddressModal from '@/components/AddressModal'
import Image from 'next/image'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const router = useRouter()
  const { formatPrice, currency } = useCurrency()
  const { cart, clearCart } = useCart()
  const user = getUser()

  const [step, setStep] = useState(1)
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery')
  const [selectedAddressId, setSelectedAddressId] = useState<string>('')
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [orderNote, setOrderNote] = useState('')
  const [discountCode, setDiscountCode] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false)

  useEffect(() => {
    if (!isAuthenticated() || cart.length === 0) {
      router.push('/cart')
    }
  }, [cart, router])

  useEffect(() => {
    if (isAuthenticated()) {
      loadAddresses()
    }
  }, [])

  const loadAddresses = async () => {
    try {
      setIsLoadingAddresses(true)
      const response = await getAddresses()
      if (response.success) {
        setAddresses(response.data.addresses)
        // Auto-select default address
        const defaultAddr = response.data.addresses.find((addr: Address) => addr.isDefault)
        if (defaultAddr && defaultAddr._id) {
          setSelectedAddressId(defaultAddr._id)
        }
      }
    } catch (error) {
      console.error('Error loading addresses:', error)
    } finally {
      setIsLoadingAddresses(false)
    }
  }

  const handleAddAddress = async (address: Omit<Address, '_id'>) => {
    try {
      const response = await addAddress(address)
      if (response.success) {
        setAddresses(response.data.addresses)
        toast.success('Address added successfully!')
        // Auto-select the new address if it's the first one or set as default
        const newAddr = response.data.addresses[response.data.addresses.length - 1]
        if (newAddr._id && (address.isDefault || addresses.length === 0)) {
          setSelectedAddressId(newAddr._id)
        }
      }
    } catch (error: any) {
      throw error
    }
  }

  const handleUpdateAddress = async (address: Omit<Address, '_id'>) => {
    if (!editingAddress?._id) return
    
    try {
      const response = await updateAddress(editingAddress._id, address)
      if (response.success) {
        setAddresses(response.data.addresses)
        toast.success('Address updated successfully!')
        setEditingAddress(null)
      }
    } catch (error: any) {
      throw error
    }
  }

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return
    
    try {
      const response = await deleteAddress(addressId)
      if (response.success) {
        setAddresses(response.data.addresses)
        if (selectedAddressId === addressId) {
          setSelectedAddressId('')
        }
        toast.success('Address deleted successfully!')
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete address')
    }
  }

  const handleSetDefault = async (addressId: string) => {
    try {
      const response = await setDefaultAddress(addressId)
      if (response.success) {
        setAddresses(response.data.addresses)
        toast.success('Default address updated!')
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to set default address')
    }
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const weight = cart.reduce((sum, item) => sum + (item.quantity * 135), 0)
  const shipping = deliveryMethod === 'delivery' ? 150 : 0
  const discount = 0
  const total = subtotal + shipping - discount

  const handlePlaceOrder = async () => {
    if (step === 1) {
      setStep(2)
      return
    }

    if (deliveryMethod === 'delivery' && !selectedAddressId) {
      toast.error('Please select a delivery address')
      return
    }

    try {
      setIsProcessing(true)
      
      const selectedAddress = addresses.find(addr => addr._id === selectedAddressId)
      const shippingAddress = deliveryMethod === 'delivery' && selectedAddress
        ? `${selectedAddress.fullName}, ${selectedAddress.addressLine1}${selectedAddress.addressLine2 ? ', ' + selectedAddress.addressLine2 : ''}, ${selectedAddress.city}, ${selectedAddress.postalCode}, ${selectedAddress.country}`
        : 'Store Pickup'

      const orderData = {
        items: cart.map(item => ({
          bookId: item.bookId,
          title: item.title,
          author: item.author,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        totalAmount: total,
        shippingAddress,
        deliveryMethod,
        orderNote,
        paymentStatus: 'pending'
      }

      const response = await createOrder(orderData)
      
      if (response.success) {
        clearCart()
        toast.success('Order placed successfully!')
        router.push(`/orders/${response.data.order._id}`)
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to place order')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-sm font-medium">
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {user?.firstName} {user?.lastName}
                </h1>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">BookStore Checkout</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600 dark:text-gray-400">{currency}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-green-50 dark:bg-green-900/20 border border-green-500 rounded text-green-700 dark:text-green-400 text-sm">
              <span>✓</span>
              <span>100% SECURE</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Checkout Steps */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order List */}
            <div className="card p-6 dark:bg-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Your order list ({cart.length} items)
              </h2>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {cart.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 pb-3 border-b dark:border-gray-700 last:border-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={48}
                      height={60}
                      className="rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.author}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Qty: {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center gap-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                step >= 1 ? 'border-bookStore-blue bg-bookStore-blue text-white' : 'border-gray-300 text-gray-400'
              }`}>
                1
              </div>
              <div className={`flex-1 h-0.5 ${step >= 2 ? 'bg-bookStore-blue' : 'bg-gray-300'}`}></div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                step >= 2 ? 'border-bookStore-blue bg-bookStore-blue text-white' : 'border-gray-300 text-gray-400'
              }`}>
                2
              </div>
            </div>

            {/* Step 1: Personal Details */}
            {step === 1 && (
              <div className="card p-6 dark:bg-gray-800">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-bookStore-blue text-white font-semibold">
                    1
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">STEP 1 OF 2</h2>
                    <p className="text-gray-600 dark:text-gray-400">Personal Details</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={`${user?.firstName} ${user?.lastName}`}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user?.email}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Delivery Details */}
            {step === 2 && (
              <div className="card p-6 dark:bg-gray-800">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-bookStore-blue text-white font-semibold">
                    2
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">STEP 2 OF 2</h2>
                    <p className="text-gray-600 dark:text-gray-400">Delivery Details</p>
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-4 font-medium">
                  How would you like to receive your order?
                </p>

                {/* Delivery Method Selection */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button
                    onClick={() => setDeliveryMethod('delivery')}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      deliveryMethod === 'delivery'
                        ? 'border-bookStore-blue bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <Truck className={`mx-auto mb-2 ${deliveryMethod === 'delivery' ? 'text-bookStore-blue' : 'text-gray-400'}`} size={32} />
                    <p className="font-medium text-gray-900 dark:text-gray-100">Delivery to my location</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Get your order delivered to a location of your choice.
                    </p>
                  </button>

                  <button
                    onClick={() => setDeliveryMethod('pickup')}
                    className={`p-4 border-2 rounded-lg transition-all relative ${
                      deliveryMethod === 'pickup'
                        ? 'border-bookStore-blue bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded">NEW</span>
                    <Store className={`mx-auto mb-2 ${deliveryMethod === 'pickup' ? 'text-bookStore-blue' : 'text-gray-400'}`} size={32} />
                    <p className="font-medium text-gray-900 dark:text-gray-100">I will pick up at store</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Pickup your order at our physical book-store by yourself.
                    </p>
                  </button>
                </div>

                {/* Address Selection (if delivery) */}
                {deliveryMethod === 'delivery' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        Your Saved Addresses ({addresses.length})
                      </h3>
                      <button 
                        onClick={() => {
                          setEditingAddress(null)
                          setIsAddressModalOpen(true)
                        }}
                        className="text-bookStore-blue hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                      >
                        <Plus size={16} />
                        NEW ADDRESS
                      </button>
                    </div>

                    {isLoadingAddresses ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bookStore-blue mx-auto"></div>
                      </div>
                    ) : addresses.length === 0 ? (
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                        <MapPin className="mx-auto mb-3 text-gray-400" size={32} />
                        <p className="text-gray-500 dark:text-gray-400 mb-4">No saved addresses</p>
                        <button 
                          onClick={() => {
                            setEditingAddress(null)
                            setIsAddressModalOpen(true)
                          }}
                          className="text-bookStore-blue hover:text-blue-700 font-medium flex items-center gap-1 mx-auto"
                        >
                          <Plus size={16} />
                          Add Your First Address
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {addresses.map((address) => (
                          <div
                            key={address._id}
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                              selectedAddressId === address._id
                                ? 'border-bookStore-blue bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                            }`}
                            onClick={() => setSelectedAddressId(address._id!)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                                    {address.label}
                                  </span>
                                  {address.isDefault && (
                                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded">
                                      Default
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                                  {address.fullName}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  {address.addressLine1}
                                  {address.addressLine2 && `, ${address.addressLine2}`}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {address.city}, {address.postalCode}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {address.country}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  Phone: {address.phone}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setEditingAddress(address)
                                    setIsAddressModalOpen(true)
                                  }}
                                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-bookStore-blue hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                                  title="Edit"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDeleteAddress(address._id!)
                                  }}
                                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                            {!address.isDefault && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleSetDefault(address._id!)
                                }}
                                className="text-xs text-bookStore-blue hover:text-blue-700 mt-2"
                              >
                                Set as default
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Order Note */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Order Note (Optional) [max 500 characters]
                  </label>
                  <textarea
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    maxLength={500}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-bookStore-blue focus:border-bookStore-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Add any special instructions for your order..."
                  />
                </div>
              </div>
            )}

            {/* Action Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing || (step === 2 && deliveryMethod === 'delivery' && !selectedAddressId)}
              className="w-full bg-bookStore-blue hover:bg-blue-700 text-white font-semibold py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : step === 1 ? 'Continue to Delivery' : 'Place Order'}
            </button>
          </div>

          {/* Right Side - Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24 dark:bg-gray-800">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Order Summary ({cart.length})
              </h2>

              {/* Discount Code */}
              <div className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    placeholder="Enter Discount Code"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                  <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg text-sm">
                    APPLY
                  </button>
                </div>
              </div>

              {/* Summary Details */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-1">
                    <span>Weight:</span>
                    <Info size={14} className="text-gray-400" />
                  </div>
                  <span className="font-medium">{weight} Grams</span>
                </div>

                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Promotional Discount:</span>
                  <span className="font-medium">{formatPrice(0)}</span>
                </div>

                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Discount Coupon</span>
                  <span className="font-medium">{formatPrice(discount)}</span>
                </div>

                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-1">
                    <span>Shipping Cost</span>
                    <Info size={14} className="text-gray-400" />
                  </div>
                  <span className="font-medium">{formatPrice(shipping)}</span>
                </div>

                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Bookmarks</span>
                  <span className="font-medium">{formatPrice(0)}</span>
                </div>

                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Gift Packaging</span>
                  <span className="font-medium">{formatPrice(0)}</span>
                </div>

                <div className="border-t dark:border-gray-700 pt-3 mt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-gray-100">
                    <span>Total:</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">(VAT INCLUDED)</p>
                </div>
              </div>

              {/* Help Section */}
              <div className="mt-6 pt-6 border-t dark:border-gray-700">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Questions? We can help.
                </p>
                <div className="flex gap-4">
                  <button className="flex items-center gap-2 text-sm text-bookStore-blue hover:text-blue-700">
                    <span>📞</span>
                    <span>Whatsapp</span>
                  </button>
                  <button className="flex items-center gap-2 text-sm text-bookStore-blue hover:text-blue-700">
                    <span>💬</span>
                    <span>Viber</span>
                  </button>
                </div>
                <button className="text-sm text-bookStore-blue hover:text-blue-700 mt-3 flex items-center gap-1">
                  <Info size={14} />
                  <span>Read Frequently Asked Questions</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => {
          setIsAddressModalOpen(false)
          setEditingAddress(null)
        }}
        onSave={editingAddress ? handleUpdateAddress : handleAddAddress}
        editAddress={editingAddress}
      />
    </MainLayout>
  )
}
