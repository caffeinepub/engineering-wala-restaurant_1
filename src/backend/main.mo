import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Float "mo:core/Float";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";

import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";


actor {
  // Types
  type MenuItem = {
    name : Text;
    description : Text;
    price : Float;
    category : Text;
    imageUrl : Text;
    isAvailable : Bool;
    isVeg : Bool;
  };

  type Offer = {
    title : Text;
    description : Text;
    promoCode : Text;
    discountText : Text;
    isActive : Bool;
    validUntil : Time.Time;
  };

  type Announcement = {
    title : Text;
    body : Text;
    isActive : Bool;
  };

  public type Testimonial = {
    customerName : Text;
    rating : Nat;
    review : Text;
    dishName : Text;
    isApproved : Bool;
  };

  public type ContactMessage = {
    name : Text;
    phone : Text;
    message : Text;
    timestamp : Time.Time;
  };

  type GalleryItem = {
    imageUrl : Text;
    caption : Text;
    isActive : Bool;
  };

  type RestaurantInfo = {
    storeHours : Text;
    contactDetails : Text;
    about : Text;
  };

  type Dish = {
    name : Text;
    price : Float;
    veg : Bool;
    category : Text;
  };

  type MenuCategory = {
    name : Text;
    items : [Dish];
  };

  public type UserProfile = {
    name : Text;
    phone : Text;
  };

  public type AppLogin = {
    name : Text;
    phone : Text;
    deviceInfo : Text;
    timestamp : Time.Time;
  };

  // Order Management
  public type OrderStatus = {
    #pending;
    #confirmed;
    #preparing;
    #ready;
    #delivered;
    #cancelled;
  };

  public type OrderItem = {
    dishName : Text;
    quantity : Nat;
    price : Float;
  };

  public type OrderInput = {
    customerName : Text;
    customerPhone : Text;
    address : Text;
    cart : [OrderItem];
    totalAmount : Float;
    specialInstructions : Text;
  };

  public type Order = {
    orderId : Text;
    customerName : Text;
    customerPhone : Text;
    address : Text;
    cart : [OrderItem];
    totalAmount : Float;
    specialInstructions : Text;
    status : OrderStatus;
    timestamp : Time.Time;
  };

  // Default Categories
  let defaultCategories = [
    "Rice & Biryani",
    "Paneer Dishes",
    "Dal & Curries",
    "Snacks & Street Food",
    "Thalis",
    "Wraps & Sandwiches",
    "Beverages",
    "Desserts",
  ];

  // Default Restaurant Info
  let defaultRestaurantInfo = {
    storeHours = "10:00 AM - 11:00 PM";
    contactDetails = "123, MG Road, Indore | Phone: +91-123456789";
    about = "Engineering Wala Restaurant offers delicious Indian cuisine in Indore.";
  };

  let defaultMenuCategories = [
    {
      name = "Rice & Biryani";
      items = [
        { name = "Veg Biryani"; price = 150.0; veg = true; category = "Rice & Biryani" },
        { name = "Jeera Rice"; price = 90.0; veg = true; category = "Rice & Biryani" },
        { name = "Plain Rice"; price = 70.0; veg = true; category = "Rice & Biryani" },
      ];
    },
    {
      name = "Paneer Dishes";
      items = [
        { name = "Paneer Butter Masala"; price = 180.0; veg = true; category = "Paneer Dishes" },
        { name = "Shahi Paneer"; price = 190.0; veg = true; category = "Paneer Dishes" },
        { name = "Kadai Paneer"; price = 175.0; veg = true; category = "Paneer Dishes" },
      ];
    },
    {
      name = "Dal & Curries";
      items = [
        { name = "Dal Tadka"; price = 110.0; veg = true; category = "Dal & Curries" },
        { name = "Mix Veg Curry"; price = 120.0; veg = true; category = "Dal & Curries" },
        { name = "Chana Masala"; price = 130.0; veg = true; category = "Dal & Curries" },
      ];
    },
    {
      name = "Snacks & Street Food";
      items = [
        { name = "Pav Bhaji"; price = 65.0; veg = true; category = "Snacks & Street Food" },
        { name = "Vada Pav"; price = 25.0; veg = true; category = "Snacks & Street Food" },
        { name = "Chole Samosa"; price = 45.0; veg = true; category = "Snacks & Street Food" },
      ];
    },
    {
      name = "Thalis";
      items = [
        { name = "Mini Thali"; price = 99.0; veg = true; category = "Thalis" },
        { name = "Executive Thali"; price = 168.0; veg = true; category = "Thalis" },
      ];
    },
    {
      name = "Wraps & Sandwiches";
      items = [
        { name = "Veg Wrap"; price = 50.0; veg = true; category = "Wraps & Sandwiches" },
        { name = "Grilled Sandwich"; price = 40.0; veg = true; category = "Wraps & Sandwiches" },
      ];
    },
    {
      name = "Beverages";
      items = [
        { name = "Shikanji"; price = 25.0; veg = true; category = "Beverages" },
        { name = "Cold Coffee"; price = 35.0; veg = true; category = "Beverages" },
      ];
    },
    {
      name = "Desserts";
      items = [
        { name = "Gulab Jamun"; price = 35.0; veg = true; category = "Desserts" },
        { name = "Rasgulla"; price = 35.0; veg = true; category = "Desserts" },
      ];
    },
  ];

  let defaultTestimonials = [
    {
      customerName = "Ravi Sharma";
      rating = 5;
      review = "Amazing food and service! The Paneer Butter Masala is a must-try.";
      dishName = "Paneer Butter Masala";
      isApproved = true;
    },
    {
      customerName = "Priya Singh";
      rating = 4;
      review = "Great ambiance and delicious thalis. Will definitely visit again!";
      dishName = "Mini Thali";
      isApproved = true;
    },
    {
      customerName = "Akash Mehta";
      rating = 5;
      review = "The best biryani in town! Highly recommended.";
      dishName = "Veg Biryani";
      isApproved = true;
    },
  ];

  let defaultOffers = [
    {
      title = "Weekend Special";
      description = "Get 20% off on all orders above ₹500 during weekends!";
      promoCode = "WEEKEND20";
      discountText = "20% off";
      isActive = true;
      validUntil = 1_725_000_000_000_000;
    },
    {
      title = "Happy Hour";
      description = "Enjoy Buy 1 Get 1 Free on beverages from 3PM - 6PM daily.";
      promoCode = "HAPPYHOUR";
      discountText = "B1G1 on drinks";
      isActive = true;
      validUntil = 1_726_000_000_000_000;
    },
  ];

  let defaultAnnouncements = [
    {
      title = "Grand Opening";
      body = "We are excited to announce the grand opening of Engineering Wala Restaurant!";
      isActive = true;
    },
    {
      title = "Monsoon Menu";
      body = "Try our special monsoon menu with delicious snacks and beverages!";
      isActive = true;
    },
  ];

  // Incorporate Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Persistent State
  let menuItems = Map.empty<Text, MenuItem>();
  let offers = Map.empty<Text, Offer>();
  let announcements = Map.empty<Text, Announcement>();
  let testimonials = Map.empty<Text, Testimonial>();
  let galleryItems = Map.empty<Text, GalleryItem>();
  let contactMessages = Map.empty<Text, ContactMessage>();
  let orders = Map.empty<Text, Order>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let appLogins = Map.empty<Text, AppLogin>();
  var restaurantInfo : RestaurantInfo = defaultRestaurantInfo;

  // Initialize with default data if not already initialized
  var isInitialized = false;

  public shared ({ caller }) func initialize() : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized. Only admin users can initialize the system. ");
    };

    if (isInitialized) { return () };

    // Add default menu items (using persistent menuItems Map)
    for (category in defaultMenuCategories.values()) {
      for (dish in category.items.values()) {
        let menuItem : MenuItem = {
          name = dish.name;
          description = "Delicious " # dish.name # " from Engineering Wala";
          price = dish.price;
          category = dish.category;
          imageUrl = "";
          isAvailable = true;
          isVeg = dish.veg;
        };
        menuItems.add(dish.name, menuItem);
      };
    };

    // Add default offers
    for (offer in defaultOffers.values()) {
      offers.add(offer.title, offer);
    };

    // Add default testimonials
    for (testimonial in defaultTestimonials.values()) {
      testimonials.add(testimonial.customerName, testimonial);
    };

    // Add default announcements
    for (announcement in defaultAnnouncements.values()) {
      announcements.add(announcement.title, announcement);
    };

    // Initialize restaurant info
    restaurantInfo := defaultRestaurantInfo;
    isInitialized := true;
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Orders Management
  // Public function - no auth required (guests can place orders)
  public shared func placeOrder(orderInput : OrderInput) : async Text {
    let orderId = Time.now().toText();
    let newOrder : Order = {
      orderInput with
      orderId;
      status = #pending;
      timestamp = Time.now();
    };
    orders.add(orderId, newOrder);
    orderId;
  };

  // Public query - customers can get their own orders by phone (no auth required for convenience)
  // Security: phone number acts as the authentication token
  public query func getOrdersByPhone(phone : Text) : async [Order] {
    orders.values().toArray().filter(
      func(o) { o.customerPhone == phone }
    );
  };

  // Public query - anyone with orderId and phone can view (phone acts as verification)
  public query func getOrderById(orderId : Text, phone : Text) : async ?Order {
    switch (orders.get(orderId)) {
      case (null) { null };
      case (?order) {
        if (order.customerPhone == phone) {
          ?order;
        } else {
          null; // Don't reveal order exists if phone doesn't match
        };
      };
    };
  };

  // Admin-only: get all orders
  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized. Only admin users can view all orders. ");
    };
    orders.values().toArray();
  };

  // Admin-only: update order status
  public shared ({ caller }) func updateOrderStatus(orderId : Text, status : OrderStatus) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized. Only admin users can update order status. ");
    };

    let order = switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order does not exist") };
      case (?o) { o };
    };
    orders.add(orderId, { order with status });
  };

  // Public function - customers can cancel their own orders using orderId + phone
  public shared func cancelOrder(orderId : Text, phone : Text) : async () {
    let order = switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order does not exist") };
      case (?o) { o };
    };

    // Verify phone number matches
    if (order.customerPhone != phone) {
      Runtime.trap("Phone number does not match order");
    };

    // Check if order can be cancelled
    if (order.status == #delivered) {
      Runtime.trap("Cannot cancel: Order already delivered");
    };

    if (order.status == #cancelled) {
      Runtime.trap("Order is already cancelled");
    };

    orders.add(orderId, { order with status = #cancelled });
  };

  // Menu Management
  public shared ({ caller }) func addMenuItem(item : MenuItem) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized. Only admin users can add menu items. ");
    };

    if (menuItems.containsKey(item.name)) {
      Runtime.trap("Menu item already exists");
    };
    menuItems.add(item.name, item);
  };

  public shared ({ caller }) func updateMenuItem(name : Text, item : MenuItem) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized. Only admin users can update menu items. ");
    };

    if (not menuItems.containsKey(name)) {
      Runtime.trap("Menu item does not exist");
    };
    menuItems.add(name, item);
  };

  public shared ({ caller }) func removeMenuItem(name : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized. Only admin users can remove menu items. ");
    };

    if (not menuItems.containsKey(name)) {
      Runtime.trap("Menu item does not exist");
    };
    menuItems.remove(name);
  };

  public query func getMenuByCategory() : async [(Text, [MenuItem])] {
    mapMenuByCategory();
  };

  func mapMenuByCategory() : [(Text, [MenuItem])] {
    let categoryItems = Map.empty<Text, List.List<MenuItem>>();

    for (item in menuItems.values()) {
      let existing = switch (categoryItems.get(item.category)) {
        case (null) { List.empty<MenuItem>() };
        case (?list) { list };
      };
      existing.add(item);
      categoryItems.add(item.category, existing);
    };

    categoryItems.toArray().map(
      func((category, list)) { (category, list.toArray()) }
    );
  };

  // Menu Category
  public query func getAllCategories() : async [MenuCategory] {
    defaultMenuCategories;
  };

  // Offers Management
  public shared ({ caller }) func addOffer(offer : Offer) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only add offers as admin.");
    };

    offers.add(offer.title, offer);
  };

  public shared ({ caller }) func updateOffer(title : Text, offer : Offer) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only update offers as admin.");
    };

    if (not offers.containsKey(title)) {
      Runtime.trap("Offer does not exist");
    };
    offers.add(title, offer);
  };

  public shared ({ caller }) func removeOffer(title : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only remove offers as admin.");
    };

    if (not offers.containsKey(title)) {
      Runtime.trap("Offer does not exist");
    };
    offers.remove(title);
  };

  // Gallery Management
  public shared ({ caller }) func addGalleryItem(item : GalleryItem) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only add gallery items as admin.");
    };

    galleryItems.add(item.caption, item);
  };

  public shared ({ caller }) func updateGalleryItem(caption : Text, item : GalleryItem) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only update gallery items as admin.");
    };

    if (not galleryItems.containsKey(caption)) {
      Runtime.trap("Gallery item does not exist");
    };
    galleryItems.add(caption, item);
  };

  public shared ({ caller }) func removeGalleryItem(caption : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only remove gallery items as admin.");
    };

    if (not galleryItems.containsKey(caption)) {
      Runtime.trap("Gallery item does not exist");
    };
    galleryItems.remove(caption);
  };

  // Announcements
  public shared ({ caller }) func addAnnouncement(announcement : Announcement) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only add announcements as admin.");
    };

    announcements.add(announcement.title, announcement);
  };

  public shared ({ caller }) func updateAnnouncement(title : Text, announcement : Announcement) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only update announcements as admin.");
    };

    if (not announcements.containsKey(title)) {
      Runtime.trap("Announcement does not exist");
    };
    announcements.add(title, announcement);
  };

  public shared ({ caller }) func removeAnnouncement(title : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only remove announcements as admin.");
    };

    if (not announcements.containsKey(title)) {
      Runtime.trap("Announcement does not exist");
    };
    announcements.remove(title);
  };

  // Testimonials
  public shared ({ caller }) func submitTestimonial(testimonial : Testimonial) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can submit testimonials");
    };

    let newTestimonial : Testimonial = {
      testimonial with
      isApproved = false;
    };
    testimonials.add(testimonial.customerName, newTestimonial);
  };

  public shared ({ caller }) func approveTestimonial(customerName : Text, approved : Bool) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only approve testimonials as admin.");
    };

    let t = switch (testimonials.get(customerName)) {
      case (null) { Runtime.trap("Testimonial does not exist") };
      case (?t) { t };
    };

    testimonials.add(customerName, { t with isApproved = approved });
  };

  public shared ({ caller }) func removeTestimonial(customerName : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only remove testimonials as admin.");
    };

    if (not testimonials.containsKey(customerName)) {
      Runtime.trap("Testimonial does not exist");
    };
    testimonials.remove(customerName);
  };

  // Contact Messages - Public, no auth required
  public shared func submitContactMessage(message : ContactMessage) : async () {
    let newMessage : ContactMessage = {
      message with
      timestamp = Time.now();
    };
    contactMessages.add(message.name # Time.now().toText(), newMessage);
  };

  // Restaurant Info
  public query func getRestaurantInfo() : async RestaurantInfo {
    restaurantInfo;
  };

  public shared ({ caller }) func updateRestaurantInfo(info : RestaurantInfo) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only update restaurant info as admin.");
    };

    restaurantInfo := info;
  };

  // Query Methods - Public, no auth required
  public query func getAllMenuItems() : async [MenuItem] {
    menuItems.values().toArray();
  };

  public query func getAllOffers() : async [Offer] {
    offers.values().toArray();
  };

  public query func getAllAnnouncements() : async [Announcement] {
    announcements.values().toArray();
  };

  public query func getAllTestimonials() : async [Testimonial] {
    testimonials.values().toArray();
  };

  public query func getAllGalleryItems() : async [GalleryItem] {
    galleryItems.values().toArray();
  };

  // Admin-only: view all contact messages
  public query ({ caller }) func getAllContactMessages() : async [ContactMessage] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin users can view contact messages.");
    };

    contactMessages.values().toArray();
  };
  // App Login Tracking - save when user logs into the app
  public shared func saveAppLogin(login : AppLogin) : async () {
    let newLogin : AppLogin = {
      login with
      timestamp = Time.now();
    };
    appLogins.add(login.phone # Time.now().toText(), newLogin);
  };

  // Admin-only: get all app logins
  public query ({ caller }) func getAllAppLogins() : async [AppLogin] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin users can view app logins.");
    };
    appLogins.values().toArray();
  };


};
