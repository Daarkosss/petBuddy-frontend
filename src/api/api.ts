import { toast } from "react-toastify";
import store from "../store/RootStore";
import { 
  CaretakerBasicsResponse, CaretakerSearchFilters, PagingParams, CaretakerFormFields, UserProfiles,
  CaretakerDetailsDTO, OfferDTO, OfferConfigurationDTO, EditOfferDescription, Availabilities,
  SetAvailabilityDTO,
  OfferDTOWithId,
  OfferConfigurationWithId
} from "../types";

const backendHost =
  import.meta.env.VITE_BACKEND_HOST || window.location.hostname;
const backendPort = import.meta.env.VITE_BACKEND_PORT || "8081";
export const PATH_PREFIX = `http://${backendHost}:${backendPort}/`;

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type User = {
  _id: string;
  name: string;
  email: string;
};

class API {
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
      throw new Error(data.message || "Wrong server response!");
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
      });
    } else {
      toast.error("No user token available");
      return Promise.reject(new Error("No user token available"));
    }
  }

  async getTestMessage(): Promise<string> {
    try {
      console.log("getting test message");
      const response = await this.authorizedFetch<string>("GET", "api/test");
      toast.success(JSON.stringify(response));
      return response;
    } catch (error: unknown) {
      return "brak";
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
    }));

    return this.fetch<CaretakerBasicsResponse>(
      "POST",
      `api/caretaker?${queryString}`,
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

  async getCaretakerDetails(email: string): Promise<CaretakerDetailsDTO> {
    try {
      const response = await this.fetch<CaretakerDetailsDTO>(
        "GET",
        `api/caretaker/${email}`
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

  async addCaretakerProfile(data: CaretakerFormFields): Promise<void> {
    return this.authorizedFetch<void>(
      "POST",
      "api/caretaker/add",
      data
    );
  }

  async editCaretakerProfile(data: CaretakerFormFields): Promise<void> {
    return this.authorizedFetch<void>(
      "PUT",
      "api/caretaker/edit",
      data
    );
  }

  async addOrEditOffer(offer: OfferDTO | EditOfferDescription): Promise<OfferDTOWithId | undefined> {
    if (store.user.profile?.selected_profile) {
      return this.authorizedFetch<OfferDTOWithId>(
        "POST",
        "api/caretaker/offer/add-or-edit",
        offer,
        { "Accept-Role": store.user.profile?.selected_profile }
      );
    }
  }

  async deleteOffer(offerId: number): Promise<OfferDTOWithId | undefined> {
    if (store.user.profile?.selected_profile) {
      return this.authorizedFetch<OfferDTOWithId>(
        "DELETE",
        `api/caretaker/offer/${offerId}`,
        undefined,
        { "Accept-Role": store.user.profile?.selected_profile }
      );
    }
  }

  async setAmenitiesForOffer(offerId: number, offerAmenities: string[]): Promise<OfferDTOWithId | undefined> {
    if (store.user.profile?.selected_profile) {
      return this.authorizedFetch<OfferDTOWithId>(
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
    availabilityRanges: Availabilities
  ): Promise<OfferDTOWithId[] | undefined> {
    const offersWithAvailabilities: SetAvailabilityDTO = {
      offerIds,
      availabilityRanges
    }
    if (store.user.profile?.selected_profile) {
      return this.authorizedFetch<OfferDTOWithId[]>(
        "PUT",
        "api/caretaker/offer/availability",
        offersWithAvailabilities,
        { "Accept-Role": store.user.profile?.selected_profile }
      )
    }
  }

  async setAvailabilityForOffer(
    offerId: number, 
    availabilityRanges: Availabilities
  ): Promise<OfferDTOWithId | undefined> {
    const response = await this.setAvailabilityForOffers([offerId], availabilityRanges);
    if (response) {
      return response[0];
    }
  }

  async addOfferConfiguration(
    offerId: number, 
    offerConfiguration: OfferConfigurationDTO
  ): Promise<OfferDTOWithId | undefined> {
    if (store.user.profile?.selected_profile) {
      return this.authorizedFetch<OfferDTOWithId>(
        "POST",
        `api/caretaker/offer/${offerId}/configurations`,
        [offerConfiguration],
        { "Accept-Role": store.user.profile?.selected_profile }
      );
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

  async deleteOfferConfiguration(configurationId: number): Promise<OfferDTOWithId | undefined> {
    if (store.user.profile?.selected_profile) {
      return this.authorizedFetch<OfferDTOWithId>(
        "DELETE",
        `api/caretaker/offer/configuration/${configurationId}`,
        undefined,
        { "Accept-Role": store.user.profile?.selected_profile }
      );
    }
  }
}

export const api = new API();
