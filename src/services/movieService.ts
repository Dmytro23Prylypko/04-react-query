import axios, { type AxiosRequestConfig } from "axios";
import type { Movie } from "../types/movie";

const options: AxiosRequestConfig = {
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
  }
}

interface MoviesHttpResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export async function fetchMovies(movieName: string, page: number): Promise<MoviesHttpResponse> {
  const response = await axios.get<MoviesHttpResponse>(`https://api.themoviedb.org/3/search/movie?query=${movieName}&page=${page}`, options);
  // return response.data.results;
  return response.data;
}