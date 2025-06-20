// MILESTONE 1
type Person = {
  readonly id: number;
  readonly name: string;
  birth_year: number;
  death_year?: number;
  biography: string;
  image: string;
};

// MILESTONE 2
type ActressNationality =
  | "American"
  | "British"
  | "Australian"
  | "Israeli-American"
  | "South African"
  | "French"
  | "Indian"
  | "Israeli"
  | "Spanish"
  | "South Korean"
  | "Chinese";

type Actress = Person & {
  most_famous_movies: [string, string, string];
  awards: string;
  nationality: ActressNationality;
};

// MILESTONE 3
function isActress(dati: unknown): dati is Actress {
  return (
    typeof dati === "object" &&
    dati !== null &&
    "id" in dati &&
    typeof dati.id === "number" &&
    "name" in dati &&
    typeof dati.name === "string" &&
    "birth_year" in dati &&
    typeof dati.birth_year === "number" &&
    "death_year" in dati &&
    typeof dati.death_year === "number" &&
    "biography" in dati &&
    typeof dati.biography === "string" &&
    "image" in dati &&
    typeof dati.image === "string" &&
    "most_famous_movies" in dati &&
    dati.most_famous_movies instanceof Array &&
    dati.most_famous_movies.length === 3 &&
    dati.most_famous_movies.every((m) => typeof m === "string") &&
    "awards" in dati &&
    typeof dati.awards === "string" &&
    "nationality" in dati &&
    typeof (dati as { nationality: unknown }).nationality === "string" &&
    (
      [
        "American",
        "British",
        "Australian",
        "Israeli-American",
        "South African",
        "French",
        "Indian",
        "Israeli",
        "Spanish",
        "South Korean",
        "Chinese",
      ] as const
    ).includes(
      (dati as { nationality: unknown }).nationality as ActressNationality
    )
  );
}

async function getActress(id: number): Promise<Actress | null> {
  try {
    const res = await fetch(`http://localhost:3333/actresses/${id}`);
    const data: unknown = await res.json();
    if (!isActress(data)) {
      throw new Error("Formato dati non valido");
    }
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Errore durante il recupero dell' attrice", error);
    } else {
      console.error("Errore sconosciuto", error);
    }
    return null;
  }
}

// MILESTONE 4
async function getAllActresses(): Promise<Actress[]> {
  try {
    const res = await fetch(`http://localhost:3333/actresses`);
    if (!res.ok) {
      throw new Error(`Errore HTTP ${res.status} ${res.statusText}`);
    }
    const data: unknown = await res.json();
    if (!(data instanceof Array)) {
      throw new Error("Formato dati non valido");
    }
    const validActresses = data.filter(isActress);
    return validActresses;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Errore durante il recupero delle attrici", error);
    } else {
      console.error("Errore sconosciuto", error);
    }
    return [];
  }
}

// MILESTONE 5
async function getActresses(ids: number[]): Promise<(Actress | null)[]> {
  try {
    const promises = ids.map((id) => getActress(id));
    const actresses = await Promise.all(promises);
    return actresses;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Errore durante il recupero delle attrici", error);
    } else {
      console.error("Errore sconosciuto", error);
    }
    return [];
  }
}
