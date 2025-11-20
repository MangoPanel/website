import { pg } from '@/app/lib/data';

export type PDF = {
    id: number;
    name: string;
    email: string;
    r2_key: string;
    favourite: boolean;
    processed: boolean;
    translated: boolean;
    page_count: number;
};

export async function pdfInsert(name: string, email: string, translated: boolean) {
    const result = await pg.query(
        'INSERT INTO pdf (name, email, translated) values ($1, $2, $3) RETURNING id',
        [name, email, translated],
    );
    return result.rows[0].id;
}

export async function pdfUpdate(name : string, r2_key : string, email : string, pageCount : number, favourite : boolean, processed : boolean, translated : boolean) {
    await pg.query(
        'UPDATE pdf SET r2_key=$2, email=$3, page_count=$4, favourite=$5, processed=$6, translated=$7 WHERE name=$1',
        [name, r2_key, email, pageCount, favourite, processed, translated]
    );
}

export async function pdfGet(name : string, email : string): Promise<PDF> {
    const result = await pg.query(
        'SELECT * FROM pdf WHERE name=$1 AND email=$2',
        [name, email]
    );
    const data = result.rows[0];
    const pdf:PDF = {
        id: data.id,
        name: data.name,
        email: data.email,
        r2_key: data.r2_key,
        favourite: data.favourite,
        processed: data.processed,
        page_count: data.page_count,
        translated: data.translated,
    };
    return pdf;
}

export async function pdfGetAll(email : string): Promise<PDF[]> {
    const result = await pg.query(
        'SELECT * FROM pdf WHERE email=$1',
        [email]
    );
    const pdfs: PDF[] = result.rows.map((row : PDF): PDF => {
        return {
            id: row.id,
            name: row.name,
            email: row.email,
            r2_key: row.r2_key,
            favourite: row.favourite,
            processed: row.processed,
            page_count: row.page_count,
            translated: row.translated,
        };
    });
    return pdfs;
}

export async function pdfNameArray(email : string): Promise<string[]> {
    const result = await pg.query(
        'SELECT name FROM pdf WHERE email=$1',
        [email]
    );
    return result.rows.map((row: { name: string }) => row.name);
}

export async function pdfDelete(email : string, id : number) {
    await pg.query(
        "DELETE FROM pdf WHERE email = $1 AND id = $2",
        [email, id]
    )
}