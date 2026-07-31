import Link from "next/link";
import { Newspaper } from "lucide-react";
import { BlogPost } from "@/types";

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block bg-white border border-gray-100 rounded-card overflow-hidden transition-all hover:-translate-y-1 hover:shadow-card"
    >
      <div className="aspect-video bg-gradient-to-br from-ds-blue to-ds-blue-dark flex items-center justify-center">
        <Newspaper size={44} className="text-white/85" />
      </div>
      <div className="p-4.5 pb-5">
        <span className="text-ds-blue text-[11.5px] font-bold uppercase tracking-wide">
          {post.tag}
        </span>
        <h4 className="text-[15.5px] font-bold my-2 leading-snug">{post.title}</h4>
        <p className="text-[13px] text-gray-500 leading-relaxed">{post.excerpt}</p>
      </div>
    </Link>
  );
}
