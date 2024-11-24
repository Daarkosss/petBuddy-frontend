import { toast } from "react-toastify";
import store from "../store/RootStore";
import NotificationWebSocket from "./NotificationWebSocket";
import {
  CaretakerBasicsResponse,
  CaretakerSearchFilters,
  PagingParams,
  CaretakerFormFields,
  UserProfiles,
  CaretakerDetailsDTO,
  OfferDTO,
  OfferConfigurationDTO,
  EditOfferDescription,
  AvailabilityRanges,
  SetAvailabilityDTO,
  OfferDTOWithId,
  OfferConfigurationWithId,
  CaretakerDetails,
  OfferWithId,
  AccountDataDTO,
  CaretakerRatingsResponse,
  AvailabilityValues,
} from "../types";
import {
  CareDTO,
  CareReservation,
  CareReservationDTO,
  GetCaresDTO,
} from "../types/care.types";
import {
  AnimalAttributes,
  AnimalConfigurationsDTO,
} from "../types/animal.types";
import { UploadFile } from "antd";
import {
  Notification,
  NotificationDTO,
  NumberOfUnreadChats,
} from "../types/notification.types";
import {
  ChatMessage,
  ChatMessagesResponse,
  ChatRoom,
  ChatsResponse,
} from "../types/chat.types";

const backendHost =
  import.meta.env.VITE_BACKEND_HOST || window.location.hostname;
const backendPort = import.meta.env.VITE_BACKEND_PORT || "8081";
export const PATH_PREFIX = `http://${backendHost}:${backendPort}/`;

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

class API {
  notificationWebSocket = new NotificationWebSocket();

  constructor() {
    this.getAnimalsConfigurations().then((animalConfigurations) => {
      store.animal.allAnimalConfigurations = animalConfigurations;
    });
  }

  async fetch<T>(
    method: Method,
    path: string,
    body?: unknown,
    headers: HeadersInit = {}
  ): Promise<T> {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        "X-XSRF-TOKEN": store.user.xsrfToken,
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include",
    } as RequestInit;

    const response = await fetch(`${PATH_PREFIX}${path}`, options);
    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message || "Wrong server response!");
      throw new Error(
        data.message + `. Status code: ${response.status}` ||
          "Wrong server response!"
      );
    } else {
      return data;
    }
  }

  async authorizedFetch<T>(
    method: Method,
    path: string,
    body?: unknown,
    headers?: HeadersInit
  ): Promise<T> {
    if (store.user.jwtToken) {
      return this.fetch<T>(method, path, body, {
        ...headers,
        Authorization: `Bearer ${store.user.jwtToken}`,
        ...headers,
      });
    } else {
      toast.error("No user token available");
      return Promise.reject(new Error("No user token available"));
    }
  }

  async authorizedMultipartFetch<T>(
    method: Method,
    path: string,
    formData: FormData,
    headers?: HeadersInit
  ): Promise<T> {
    const options = {
      method,
      headers: {
        ...headers,
        "X-XSRF-TOKEN": store.user.xsrfToken,
        Authorization: `Bearer ${store.user.jwtToken}`,
      },
      body: formData,
      credentials: "include",
    } as RequestInit;

    const response = await fetch(`${PATH_PREFIX}${path}`, options);
    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message || "Wrong server response!");
      throw new Error(data.message || "Wrong server response!");
    } else {
      return data;
    }
  }

  async getXsrfToken(): Promise<void> {
    try {
      const response = await this.fetch<void>("GET", "api/csrf");
      return response;
    } catch (error: unknown) {
      return;
    }
  }

  async getChatRoomWithGivenUser(
    participantEmail: string,
    acceptTimezone: string | null
  ): Promise<ChatRoom> {
    try {
      const headers: HeadersInit = {
        "Accept-Role": store.user.profile!.selected_profile!.toUpperCase(),
      };
      if (acceptTimezone !== null) {
        headers["Accept-Timezone"] = acceptTimezone;
      }
      const response = await this.authorizedFetch<ChatRoom>(
        "GET",
        `api/chat/${participantEmail}`,
        null,
        headers
      );
      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to find chat: ${error.message}`);
      }
      throw new Error(
        "An unknown error occurred while fetching caretaker profile"
      );
    }
  }

  async initializeChatRoom(
    messageReceiverEmail: string,
    content: string,
    acceptTimezone: string | null
  ): Promise<ChatMessage> {
    const headers: HeadersInit = {
      "Accept-Role": store.user.profile!.selected_profile!.toUpperCase(),
    };
    if (acceptTimezone !== null) {
      headers["Accept-Timezone"] = acceptTimezone;
    }
    return this.authorizedFetch<ChatMessage>(
      "POST",
      `api/chat/${messageReceiverEmail}`,
      {
        content: content,
      },
      headers
    );
  }

  async getMessagesFromSpecifiedChatRoom(
    chatId: number,
    page: string | null,
    size: string | null,
    acceptTimezone: string | null
  ): Promise<ChatMessagesResponse> {
    try {
      const headers: HeadersInit = {
        "Accept-Role": store.user.profile!.selected_profile!.toUpperCase(),
      };
      if (acceptTimezone !== null) {
        headers["Accept-Timezone"] = acceptTimezone;
      }
      const response = await this.authorizedFetch<ChatMessagesResponse>(
        "GET",
        `api/chat/${chatId}/messages?page=${page}&size=${size}`,
        null,
        headers
      );
      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to find chat: ${error.message}`);
      }
      throw new Error(
        "An unknown error occurred while fetching caretaker profile"
      );
    }
  }

  async getCaretakers(
    pagingParams: PagingParams,
    filters: CaretakerSearchFilters
  ): Promise<CaretakerBasicsResponse> {
    const queryParams = new URLSearchParams({
      page: pagingParams.page.toString(),
      size: pagingParams.size.toString(),
    });

    if (pagingParams.sortBy) {
      queryParams.append("sortBy", pagingParams.sortBy);
    }
    if (pagingParams.sortDirection) {
      queryParams.append("sortDirection", pagingParams.sortDirection);
    }

    if (filters.personalDataLike) {
      queryParams.append("personalDataLike", filters.personalDataLike);
    }
    if (filters.cityLike) {
      queryParams.append("cityLike", filters.cityLike);
    }
    if (filters.voivodeship) {
      queryParams.append("voivodeship", filters.voivodeship);
    }

    const queryString = queryParams.toString();
    const requestBody = filters.animals?.map((animal) => ({
      animalType: animal.animalType,
      offerConfigurations: animal.offerConfigurations.map((offer) => ({
        ...offer,
        minPrice: offer.minPrice ? offer.minPrice : 0.01,
        maxPrice: offer.maxPrice ? offer.maxPrice : 99999.99,
      })),
      availabilities: filters.availabilities
        ? this.convertValuesToAvailabilityRanges(filters.availabilities)
        : [],
    }));

    return this.fetch<CaretakerBasicsResponse>(
      "POST",
      `api/caretaker/all?${queryString}`,
      requestBody
    );
  }

  async getUserProfiles(): Promise<UserProfiles> {
    try {
      const response = await this.authorizedFetch<UserProfiles>(
        "GET",
        "api/user/available-profiles"
      );
      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch user profiles: ${error.message}`);
      }
      throw new Error("An unknown error occurred while fetching user profiles");
    }
  }

  async getCaretakerDetails(email: string): Promise<CaretakerDetails> {
    try {
      const response = await this.fetch<CaretakerDetailsDTO>(
        "GET",
        `api/caretaker/${email}`
      );
      return {
        ...response,
        offers: this.convertOffersAvailabilities(response.offers),
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch caretaker profile: ${error.message}`);
      }
      throw new Error(
        "An unknown error occurred while fetching caretaker profile"
      );
    }
  }

  async getCurrentCaretakerDetails(): Promise<CaretakerDetails> {
    try {
      const response = await this.authorizedFetch<CaretakerDetailsDTO>(
        "GET",
        "api/caretaker",
        undefined,
        { "Accept-Role": "CARETAKER" }
      );
      return {
        ...response,
        offers: this.convertOffersAvailabilities(response.offers),
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch caretaker profile: ${error.message}`);
      }
      throw new Error(
        "An unknown error occurred while fetching caretaker profile"
      );
    }
  }

  async getClientDetails(acceptRole: string): Promise<AccountDataDTO> {
    try {
      const response = await this.authorizedFetch<AccountDataDTO>(
        "GET",
        "api/client",
        { "Accept-Role": acceptRole }
      );
      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch caretaker profile: ${error.message}`);
      }
      throw new Error(
        "An unknown error occurred while fetching caretaker profile"
      );
    }
  }

  //TODO: popraw
  async getCaretakerRatings(
    email: string,
    page: number | null,
    size: number | null,
    sortDirection: string | null,
    sortBy: string[] | null
  ): Promise<CaretakerRatingsResponse> {
    try {
      let endpoint = `api/rating/${email}`;
      if (page !== null) {
        endpoint = endpoint.concat(`page=${page}`);
      }

      if (size !== null) {
        endpoint = endpoint.concat("", `&size=${size}`);
      }
      if (sortDirection !== null) {
        endpoint = endpoint.concat("", `&sortDirection=${sortDirection}`);
      }

      if (sortBy !== null) {
        endpoint = endpoint.concat("", `&sortBy=${sortBy}`);
      }
      const response = await this.fetch<CaretakerRatingsResponse>(
        "GET",
        endpoint
      );
      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch caretaker profile: ${error.message}`);
      }
      throw new Error(
        "An unknown error occurred while fetching caretaker profile"
      );
    }
  }

  async addCaretakerProfile(
    formFields: CaretakerFormFields,
    photos: UploadFile[]
  ): Promise<CaretakerDetails | void> {
    const formData = new FormData();

    const caretakerData = new Blob([JSON.stringify(formFields)], {
      type: "application/json",
    });
    formData.append("caretakerData", caretakerData);

    photos.forEach((photo) => {
      if (photo.originFileObj) {
        formData.append("newOfferPhotos", photo.originFileObj);
      }
    });

    const response = await this.authorizedMultipartFetch<CaretakerDetailsDTO>(
      "POST",
      "api/caretaker",
      formData
    );
    return {
      ...response,
      offers: this.convertOffersAvailabilities(response.offers),
    };
  }

  async editCaretakerProfile(
    formFields: CaretakerFormFields,
    newPhotos: UploadFile[],
    offerBlobsToKeep: string[]
  ): Promise<CaretakerDetails | void> {
    if (store.user.profile?.selected_profile === "CARETAKER") {
      const formData = new FormData();

      const caretakerData = new Blob([JSON.stringify(formFields)], {
        type: "application/json",
      });
      formData.append("caretakerData", caretakerData);

      const blobsData = new Blob([JSON.stringify(offerBlobsToKeep)], {
        type: "application/json",
      });
      formData.append("offerBlobsToKeep", blobsData);

      newPhotos.forEach((photo) => {
        if (photo.originFileObj) {
          formData.append("newOfferPhotos", photo.originFileObj);
        }
      });

      const response = await this.authorizedMultipartFetch<CaretakerDetailsDTO>(
        "PUT",
        "api/caretaker",
        formData,
        { "Accept-Role": "CARETAKER" }
      );
      return {
        ...response,
        offers: this.convertOffersAvailabilities(response.offers),
      };
    }
  }

  async addOrEditOffer(
    offer: OfferDTO | EditOfferDescription
  ): Promise<OfferWithId | undefined> {
    if (store.user.profile?.selected_profile) {
      return this.authorizedFetch<OfferWithId>(
        "POST",
        "api/caretaker/offer/add-or-edit",
        offer,
        { "Accept-Role": store.user.profile?.selected_profile }
      );
    }
  }

  async deleteOffer(offerId: number): Promise<OfferWithId | undefined> {
    if (store.user.profile?.selected_profile) {
      const response = await this.authorizedFetch<OfferDTOWithId>(
        "DELETE",
        `api/caretaker/offer/${offerId}`,
        undefined,
        { "Accept-Role": store.user.profile?.selected_profile }
      );
      return {
        ...response,
        availabilities: this.convertAvailabilityRangesToValues(
          response.availabilities
        ),
      };
    }
  }

  async setAmenitiesForOffer(
    offerId: number,
    offerAmenities: string[]
  ): Promise<OfferWithId | undefined> {
    if (store.user.profile?.selected_profile) {
      return this.authorizedFetch<OfferWithId>(
        "PUT",
        `api/caretaker/offer/${offerId}/amenities`,
        offerAmenities,
        { "Accept-Role": store.user.profile?.selected_profile }
      );
    }
  }

  async deleteAmenitiesForOffer(offerId: number): Promise<void> {
    if (store.user.profile?.selected_profile) {
      return this.authorizedFetch<void>(
        "DELETE",
        `api/caretaker/offer/${offerId}/amenities`,
        undefined,
        { "Accept-Role": store.user.profile?.selected_profile }
      );
    }
  }

  async setAvailabilityForOffers(
    offerIds: number[],
    availabilities: string[][]
  ): Promise<OfferWithId[] | undefined> {
    const offersWithAvailabilities: SetAvailabilityDTO = {
      offerIds,
      availabilityRanges:
        this.convertValuesToAvailabilityRanges(availabilities),
    };
    if (store.user.profile?.selected_profile) {
      const response = await this.authorizedFetch<OfferDTOWithId[]>(
        "PUT",
        "api/caretaker/offer/availability",
        offersWithAvailabilities,
        { "Accept-Role": store.user.profile?.selected_profile }
      );
      return this.convertOffersAvailabilities(response);
    }
  }

  async setAvailabilityForOffer(
    offerId: number,
    availabilities: string[][]
  ): Promise<OfferWithId | undefined> {
    const response = await this.setAvailabilityForOffers(
      [offerId],
      availabilities
    );
    if (response) {
      return response[0];
    }
  }

  async addOfferConfiguration(
    offerId: number,
    offerConfiguration: OfferConfigurationDTO
  ): Promise<OfferWithId | undefined> {
    if (store.user.profile?.selected_profile) {
      const response = await this.authorizedFetch<OfferDTOWithId>(
        "POST",
        `api/caretaker/offer/${offerId}/configurations`,
        [offerConfiguration],
        { "Accept-Role": store.user.profile?.selected_profile }
      );
      return {
        ...response,
        availabilities: this.convertAvailabilityRangesToValues(
          response.availabilities
        ),
      };
    }
  }

  async editOfferConfiguration(
    configurationId: number,
    offerConfiguration: OfferConfigurationDTO
  ): Promise<OfferConfigurationWithId | undefined> {
    if (store.user.profile?.selected_profile) {
      return this.authorizedFetch<OfferConfigurationWithId>(
        "PUT",
        `api/caretaker/offer/configuration/${configurationId}`,
        offerConfiguration,
        { "Accept-Role": store.user.profile?.selected_profile }
      );
    }
  }

  async uploadProfilePicture(profilePicture: File): Promise<AccountDataDTO> {
    const formData = new FormData();
    formData.append("profilePicture", profilePicture);

    return this.authorizedMultipartFetch<AccountDataDTO>(
      "PUT",
      "api/user/profile-picture",
      formData
    );
  }

  async deleteOfferConfiguration(
    configurationId: number
  ): Promise<OfferWithId | undefined> {
    if (store.user.profile?.selected_profile) {
      const response = await this.authorizedFetch<OfferDTOWithId>(
        "DELETE",
        `api/caretaker/offer/configuration/${configurationId}`,
        undefined,
        { "Accept-Role": store.user.profile?.selected_profile }
      );
      return {
        ...response,
        availabilities: this.convertAvailabilityRangesToValues(
          response.availabilities
        ),
      };
    }
  }

  async getAnimalsConfigurations(): Promise<AnimalConfigurationsDTO> {
    return this.fetch<AnimalConfigurationsDTO>("GET", "api/animal/complex");
  }

  async makeCareReservation(
    caretakerEmail: string,
    careReservation: CareReservation
  ): Promise<CareDTO | undefined> {
    if (store.user.profile?.selected_profile === "CLIENT") {
      const [dateFrom, dateTo] = careReservation.dateRange;
      const body: CareReservationDTO = {
        animalType: careReservation.animalType,
        selectedOptions: Object.entries(careReservation.selectedOptions).reduce(
          (acc, [key, value]) => {
            acc[key] = Array.isArray(value) ? value : [value];
            return acc;
          },
          {} as AnimalAttributes
        ),
        description: careReservation.description,
        dailyPrice: careReservation.dailyPrice,
        careStart: dateFrom?.toString() || "",
        careEnd: dateTo?.toString() || dateFrom?.toString() || "",
      };

      return this.authorizedFetch<CareDTO>(
        "POST",
        `api/care/${caretakerEmail}`,
        body,
        { "Accept-Role": "CLIENT" }
      );
    }
  }

  async getCares(pagingParams: PagingParams): Promise<GetCaresDTO | undefined> {
    if (store.user.profile?.selected_profile) {
      const queryParams = new URLSearchParams({
        page: pagingParams.page.toString(),
        size: pagingParams.size.toString(),
      });

      if (pagingParams.sortBy) {
        queryParams.append("sortBy", pagingParams.sortBy);
      }
      if (pagingParams.sortDirection) {
        queryParams.append("sortDirection", pagingParams.sortDirection);
      }

      const queryString = queryParams.toString();
      return this.authorizedFetch<GetCaresDTO>(
        "GET",
        `api/care?${queryString}`,
        undefined,
        { "Accept-Role": store.user.profile?.selected_profile }
      );
    }
  }

  async getCare(careId: number): Promise<CareDTO | undefined> {
    if (store.user.profile?.selected_profile) {
      return this.authorizedFetch<CareDTO>("GET", `api/care/${careId}`);
    }
  }

  async acceptCare(careId: number): Promise<CareDTO | undefined> {
    if (store.user.profile?.selected_profile) {
      return this.authorizedFetch<CareDTO>(
        "POST",
        `api/care/${careId}/accept`,
        undefined,
        { "Accept-Role": store.user.profile?.selected_profile }
      );
    }
  }

  async rejectCare(careId: number): Promise<CareDTO | undefined> {
    if (store.user.profile?.selected_profile) {
      return this.authorizedFetch<CareDTO>(
        "POST",
        `api/care/${careId}/reject`,
        undefined,
        { "Accept-Role": store.user.profile?.selected_profile }
      );
    }
  }

  async updateCarePrice(
    careId: number,
    dailyPrice: number
  ): Promise<CareDTO | undefined> {
    if (store.user.profile?.selected_profile === "CARETAKER") {
      return this.authorizedFetch<CareDTO>(
        "PATCH",
        `api/care/${careId}`,
        { dailyPrice },
        { "Accept-Role": "CARETAKER" }
      );
    }
  }

  async getNotifications(): Promise<NotificationDTO | undefined> {
    if (store.user.profile?.selected_profile) {
      const queryParams = new URLSearchParams({
        page: "0",
        size: "1000000", // To fetch all notifications
        sortBy: "createdAt",
        sortDirection: "DESC",
      });

      return this.authorizedFetch<NotificationDTO>(
        "GET",
        `api/notifications?${queryParams}`,
        undefined,
        { "Accept-Role": store.user.profile?.selected_profile }
      );
    }
  }

  async markNotificationAsRead(
    notificationId: number
  ): Promise<Notification | undefined> {
    if (store.user.profile?.selected_profile) {
      return this.authorizedFetch<Notification>(
        "PATCH",
        `api/notifications/${notificationId}`,
        undefined,
        { "Accept-Role": store.user.profile?.selected_profile }
      );
    }
  }

  async markAllNotificationsAsRead(): Promise<void> {
    if (store.user.profile?.selected_profile) {
      this.authorizedFetch<void>(
        "POST",
        "api/notifications/all-read",
        undefined,
        { "Accept-Role": store.user.profile?.selected_profile }
      );
    }
  }

  async connectNotificationWebSocket(): Promise<void> {
    this.notificationWebSocket.initWebsocketConnection();
  }

  async getNumberOfUnreadChats(): Promise<number | undefined> {
    if (store.user.profile?.selected_profile) {
      const data = await this.authorizedFetch<NumberOfUnreadChats>(
        "GET",
        "api/chat/unread/count"
      );
      if (store.user.profile.selected_profile === "CLIENT") {
        return data.unseenChatsAsClient;
      } else {
        return data.unseenChatsAsCaretaker;
      }
    }
  }

  async getUserChats(
    pagingParams: PagingParams,
    acceptTimezone: string | null
  ): Promise<ChatsResponse | undefined> {
    if (store.user.profile?.selected_profile) {
      const queryParams = new URLSearchParams({
        page: pagingParams.page.toString(),
        size: pagingParams.size.toString(),
      });
      const headers: HeadersInit = {
        "Accept-Role": store.user.profile!.selected_profile,
      };

      if (acceptTimezone !== null) {
        headers["Accept-Timzeone"] = acceptTimezone;
      }

      return await this.authorizedFetch<ChatsResponse>(
        "GET",
        `api/chat?${queryParams}`,
        undefined,
        headers
      );
    }
  }

  convertOffersAvailabilities = (offers: OfferDTOWithId[]): OfferWithId[] => {
    return offers.map((offer) => this.convertOfferAvailabilities(offer));
  };

  convertOfferAvailabilities = (offer: OfferDTOWithId): OfferWithId => {
    return {
      ...offer,
      availabilities: this.convertAvailabilityRangesToValues(
        offer.availabilities
      ),
    };
  };

  convertAvailabilityRangesToValues = (
    availabilities: AvailabilityRanges
  ): AvailabilityValues => {
    return availabilities.map((availability) => [
      availability.availableFrom,
      availability.availableTo || availability.availableFrom,
    ]);
  };

  convertValuesToAvailabilityRanges = (
    values: AvailabilityValues
  ): AvailabilityRanges => {
    return values.map(([from, to]) => ({
      availableFrom: from?.toString() || "",
      availableTo: to?.toString() || from?.toString() || "",
    }));
  };
}

export const api = new API();
