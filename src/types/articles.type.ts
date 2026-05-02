export type ArticleType = {
    id: string;
    title: string;
    description: string;
    image: string;
    date: string;
    category: string;
    url: string;
}

export type BlogResponseType = {
    count: number;
    pages: number;
    items: ArticleType[];
}

export type ArticleCoreType = ArticleType & {
    text: string;
    commentsCount: number;
    comments: ArticleComentType[];
}

export type ArticleComentType = {
    id: string;
    text: string;
    date: string;
    likesCount: number;
    dislikesCount: number;
    user: {
        id: string;
        name: string;
    }
}

export type CommentsWithAction = ArticleComentType & {
    action?: string;
}

export type CommentResponseType = {
    allCount: number;
    comments: ArticleComentType[];
}

export type CommentRequestBodyType = {
    text: string;
    article: string;
}

export type UserActionCommentType = {
    comment: string;
    action: string;
}