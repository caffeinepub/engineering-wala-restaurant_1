import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface MenuCategory {
    name: string;
    items: Array<Dish>;
}
export interface OrderItem {
    dishName: string;
    quantity: bigint;
    price: number;
}
export interface OrderInput {
    customerName: string;
    customerPhone: string;
    cart: Array<OrderItem>;
    specialInstructions: string;
    totalAmount: number;
    address: string;
}
export interface Dish {
    veg: boolean;
    name: string;
    category: string;
    price: number;
}
export interface Order {
    customerName: string;
    status: OrderStatus;
    customerPhone: string;
    cart: Array<OrderItem>;
    orderId: string;
    specialInstructions: string;
    totalAmount: number;
    address: string;
    timestamp: Time;
}
export interface MenuItem {
    name: string;
    isAvailable: boolean;
    description: string;
    imageUrl: string;
    category: string;
    isVeg: boolean;
    price: number;
}
export interface ContactMessage {
    name: string;
    message: string;
    timestamp: Time;
    phone: string;
}
export interface RestaurantInfo {
    about: string;
    storeHours: string;
    contactDetails: string;
}
export interface Offer {
    title: string;
    discountText: string;
    description: string;
    isActive: boolean;
    promoCode: string;
    validUntil: Time;
}
export interface Announcement {
    title: string;
    body: string;
    isActive: boolean;
}
export interface GalleryItem {
    isActive: boolean;
    imageUrl: string;
    caption: string;
}
export interface UserProfile {
    name: string;
    phone: string;
}
export interface Testimonial {
    customerName: string;
    review: string;
    isApproved: boolean;
    dishName: string;
    rating: bigint;
}
export interface AppLogin {
    name: string;
    phone: string;
    deviceInfo: string;
    timestamp: Time;
}
export enum OrderStatus {
    preparing = "preparing",
    cancelled = "cancelled",
    pending = "pending",
    delivered = "delivered",
    confirmed = "confirmed",
    ready = "ready"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAnnouncement(announcement: Announcement): Promise<void>;
    addGalleryItem(item: GalleryItem): Promise<void>;
    addMenuItem(item: MenuItem): Promise<void>;
    addOffer(offer: Offer): Promise<void>;
    approveTestimonial(customerName: string, approved: boolean): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    cancelOrder(orderId: string, phone: string): Promise<void>;
    getAllAnnouncements(): Promise<Array<Announcement>>;
    getAllCategories(): Promise<Array<MenuCategory>>;
    getAllContactMessages(): Promise<Array<ContactMessage>>;
    getAllGalleryItems(): Promise<Array<GalleryItem>>;
    getAllMenuItems(): Promise<Array<MenuItem>>;
    getAllOffers(): Promise<Array<Offer>>;
    getAllOrders(): Promise<Array<Order>>;
    getAllTestimonials(): Promise<Array<Testimonial>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMenuByCategory(): Promise<Array<[string, Array<MenuItem>]>>;
    getOrderById(orderId: string, phone: string): Promise<Order | null>;
    getOrdersByPhone(phone: string): Promise<Array<Order>>;
    getRestaurantInfo(): Promise<RestaurantInfo>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initialize(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(orderInput: OrderInput): Promise<string>;
    removeAnnouncement(title: string): Promise<void>;
    removeGalleryItem(caption: string): Promise<void>;
    removeMenuItem(name: string): Promise<void>;
    removeOffer(title: string): Promise<void>;
    removeTestimonial(customerName: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitContactMessage(message: ContactMessage): Promise<void>;
    submitTestimonial(testimonial: Testimonial): Promise<void>;
    updateAnnouncement(title: string, announcement: Announcement): Promise<void>;
    updateGalleryItem(caption: string, item: GalleryItem): Promise<void>;
    updateMenuItem(name: string, item: MenuItem): Promise<void>;
    updateOffer(title: string, offer: Offer): Promise<void>;
    updateOrderStatus(orderId: string, status: OrderStatus): Promise<void>;
    getAllAppLogins(): Promise<Array<AppLogin>>;
    saveAppLogin(login: AppLogin): Promise<void>;
    updateRestaurantInfo(info: RestaurantInfo): Promise<void>;
}
