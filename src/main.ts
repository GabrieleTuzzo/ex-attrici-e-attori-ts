type Person = {
    readonly id: number;
    readonly name: string;
    birth_year: number;
    death_year?: number;
    biography: string;
    image: string;
};

type Actress = Person & {
    most_famous_movie: [string, string, string];
    awards: string;
    nationality:
        | 'American'
        | 'British'
        | 'Australian'
        | 'Israeli-American'
        | 'South African'
        | 'French'
        | 'Indian'
        | 'Israeli'
        | 'Spanish'
        | 'South Korean'
        | 'Chinese';
};

function isActress(data: any): data is Actress {
    return (
        typeof data.id === 'number' &&
        typeof data.name === 'string' &&
        typeof data.birth_year === 'number' &&
        (typeof data.death_year === 'undefined' ||
            typeof data.death_year === 'number') &&
        typeof data.biography === 'string' &&
        typeof data.image === 'string' &&
        Array.isArray(data.most_famous_movie) &&
        data.most_famous_movie.length === 3 &&
        data.most_famous_movie.every(
            (item: unknown) => typeof item === 'string'
        ) &&
        typeof data.awards === 'string' &&
        [
            'American',
            'British',
            'Australian',
            'Israeli-American',
            'South African',
            'French',
            'Indian',
            'Israeli',
            'Spanish',
            'South Korean',
            'Chinese',
        ].includes(data.nationality)
    );
}

async function getActress(id: number): Promise<Actress | null> {
    try {
        const response = await fetch(
            `https://boolean-spec-frontend.vercel.app/freetestapi/actresses/${id}`
        );

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        if (isActress(data)) {
            return data;
        } else {
            throw new Error('Invalid Actress data');
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

function getAllActresses(): Promise<Actress[]> {
    return fetch(
        'https://boolean-spec-frontend.vercel.app/freetestapi/actresses'
    )
        .then((response) => response.json())
        .then((data) => {
            if (Array.isArray(data)) {
                return data.filter(isActress);
            } else {
                throw new Error('Invalid data format');
            }
        });
}

function getActresses(ids_array: number[]): Promise<Actress[]> {
    return Promise.all(ids_array.map(getActress))
        .then((actresses) => actresses.filter((actress) => actress !== null))
        .catch((error) => {
            console.error(error);
            return [];
        });
}
