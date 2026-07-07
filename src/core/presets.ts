import type { DesignConfig } from './design-config.js'

type DeepPartial<T> = { [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P] }

export interface BrandPreset {
  name: string
  hex: string
  label: string
  designConfig?: DeepPartial<DesignConfig>
}

export interface FontPreset {
  name: string
  googleName: string
  label: string
  fallback: string
}

export const BRAND_PRESETS: BrandPreset[] = [
  {
    name: 'Stripe', hex: '#635BFF', label: '高端科技',
    designConfig: {
      shape: { radius: 'lg' },
      elevation: { style: 'subtle', separator: 'shadow' },
      components: { cardStyle: 'bordered', inputStyle: 'outline' },
      motion: { hoverEffect: 'scale', cardHover: 'lift' },
      visualStyle: { decorative: 'grid-lines', gradient: 'primary' },
      typography: { letterSpacing: 'normal' },
    },
  },
  {
    name: 'Linear', hex: '#5E6AD2', label: '开发者工具',
    designConfig: {
      shape: { radius: 'lg', borderStyle: 'subtle' },
      elevation: { style: 'subtle', separator: 'shadow' },
      components: { cardStyle: 'bordered' },
      motion: { hoverEffect: 'opacity', cardHover: 'lift' },
      visualStyle: { decorative: 'grid-lines', gradient: 'none' },
      typography: { letterSpacing: 'tight' },
    },
  },
  {
    name: 'Vercel', hex: '#171717', label: '极简开发者',
    designConfig: {
      shape: { radius: 'none', borderStyle: 'none' },
      elevation: { style: 'flat', separator: 'border' },
      components: { buttonShape: 'square', cardStyle: 'flat' },
      motion: { hoverEffect: 'opacity', cardHover: 'none' },
      visualStyle: { decorative: 'none', gradient: 'none' },
      typography: { letterSpacing: 'tight' },
    },
  },
  {
    name: 'Spotify', hex: '#1DB954', label: '活力消费',
    designConfig: {
      shape: { radius: 'xl' },
      elevation: { style: 'medium', separator: 'shadow' },
      components: { buttonShape: 'pill', cardStyle: 'elevated' },
      motion: { hoverEffect: 'scale', cardHover: 'lift' },
      visualStyle: { decorative: 'none', gradient: 'primary' },
    },
  },
  {
    name: 'Shopify', hex: '#008060', label: '电商增长',
    designConfig: {
      shape: { radius: 'lg' },
      elevation: { style: 'subtle', separator: 'border' },
      components: { cardStyle: 'bordered' },
      motion: { hoverEffect: 'scale', cardHover: 'lift' },
      visualStyle: { gradient: 'primary' },
    },
  },
  {
    name: 'IBM', hex: '#0F62FE', label: '企业信任',
    designConfig: {
      typography: { weightStyle: 'medium', letterSpacing: 'wide' },
      shape: { density: 'compact', borderStyle: 'solid', radius: 'sm' },
      elevation: { separator: 'border' },
      components: { cardStyle: 'bordered', tableStyle: 'bordered' },
      motion: { hoverEffect: 'none', cardHover: 'none' },
      visualStyle: { decorative: 'none', gradient: 'none' },
    },
  },
  {
    name: 'Airbnb', hex: '#FF5A5F', label: '温暖亲切',
    designConfig: {
      typography: { weightStyle: 'bold' },
      shape: { radius: 'xl' },
      elevation: { style: 'medium', separator: 'shadow' },
      components: { buttonShape: 'pill', cardStyle: 'elevated' },
      motion: { hoverEffect: 'scale', cardHover: 'lift' },
      visualStyle: { gradient: 'none' },
    },
  },
  {
    name: 'OpenAI', hex: '#10A37F', label: 'AI 科技',
    designConfig: {
      typography: { weightStyle: 'normal', letterSpacing: 'normal' },
      shape: { density: 'comfortable', borderStyle: 'subtle', radius: 'lg' },
      elevation: { style: 'medium', separator: 'shadow' },
      components: { cardStyle: 'elevated' },
      motion: { hoverEffect: 'opacity', cardHover: 'lift' },
      visualStyle: { decorative: 'gradient-blob', gradient: 'none' },
    },
  },
  {
    name: 'Coinbase', hex: '#0052FF', label: '金融数据',
    designConfig: {
      typography: { weightStyle: 'bold' },
      shape: { borderStyle: 'none', radius: 'xl' },
      elevation: { style: 'dramatic', separator: 'shadow' },
      components: { buttonShape: 'pill', cardStyle: 'glass', inputStyle: 'filled' },
      motion: { hoverEffect: 'glow', cardHover: 'glow' },
      visualStyle: { decorative: 'gradient-blob', gradient: 'spectrum' },
    },
  },
  {
    name: 'Notion', hex: '#E16259', label: '生产力工具',
    designConfig: {
      shape: { radius: 'sm', borderStyle: 'solid' },
      elevation: { style: 'flat', separator: 'border' },
      components: { cardStyle: 'bordered', inputStyle: 'outline' },
      motion: { hoverEffect: 'none', cardHover: 'none' },
      visualStyle: { decorative: 'none', gradient: 'none' },
    },
  },
  {
    name: 'Figma', hex: '#A259FF', label: '创意设计',
    designConfig: {
      shape: { radius: 'xl' },
      elevation: { style: 'dramatic', separator: 'shadow' },
      components: { buttonShape: 'pill', cardStyle: 'glass' },
      motion: { hoverEffect: 'glow', cardHover: 'glow' },
      visualStyle: { decorative: 'gradient-blob', gradient: 'spectrum' },
    },
  },
  {
    name: 'Slack', hex: '#611F69', label: '协作沟通',
    designConfig: {
      shape: { radius: 'md' },
      elevation: { style: 'subtle', separator: 'border' },
      components: { buttonShape: 'default', cardStyle: 'bordered' },
      motion: { hoverEffect: 'opacity', cardHover: 'lift' },
    },
  },
  {
    name: 'Twitter/X', hex: '#1D9BF0', label: '社交媒体',
    designConfig: {
      shape: { radius: 'full' },
      elevation: { style: 'flat', separator: 'border' },
      components: { buttonShape: 'pill', cardStyle: 'flat' },
      motion: { hoverEffect: 'opacity', cardHover: 'none' },
      typography: { letterSpacing: 'tight' },
    },
  },
  {
    name: 'GitHub', hex: '#238636', label: '开源社区',
    designConfig: {
      shape: { radius: 'md', borderStyle: 'solid' },
      elevation: { style: 'subtle', separator: 'border' },
      components: { cardStyle: 'bordered', tableStyle: 'bordered' },
      motion: { hoverEffect: 'none', cardHover: 'none' },
    },
  },
  {
    name: 'Calm', hex: '#4B7BEC', label: '健康平静',
    designConfig: {
      typography: { weightStyle: 'normal' },
      shape: { density: 'comfortable', radius: 'full' },
      elevation: { style: 'flat', separator: 'space' },
      components: { buttonShape: 'pill', cardStyle: 'flat', inputStyle: 'underline' },
      motion: { hoverEffect: 'opacity', cardHover: 'lift' },
      visualStyle: { decorative: 'gradient-blob', gradient: 'primary' },
    },
  },
  {
    name: 'Headspace', hex: '#F47D31', label: '温暖正面',
    designConfig: {
      typography: { weightStyle: 'bold' },
      shape: { density: 'comfortable', radius: 'xl' },
      elevation: { style: 'medium', separator: 'shadow' },
      components: { buttonShape: 'pill', cardStyle: 'elevated' },
      motion: { hoverEffect: 'scale', cardHover: 'lift' },
      visualStyle: { decorative: 'dots', gradient: 'primary' },
    },
  },
  {
    name: 'Nike', hex: '#111111', label: '运动品牌',
    designConfig: {
      typography: { weightStyle: 'bold', letterSpacing: 'wide' },
      shape: { radius: 'none', borderStyle: 'none' },
      elevation: { style: 'flat', separator: 'space' },
      components: { buttonShape: 'square', cardStyle: 'flat' },
      motion: { hoverEffect: 'scale', cardHover: 'none' },
      visualStyle: { decorative: 'none', gradient: 'none' },
    },
  },
  {
    name: 'Dribbble', hex: '#EA4C89', label: '设计社区',
    designConfig: {
      shape: { radius: 'xl' },
      elevation: { style: 'medium', separator: 'shadow' },
      components: { buttonShape: 'pill', cardStyle: 'elevated' },
      motion: { hoverEffect: 'scale', cardHover: 'lift' },
      visualStyle: { decorative: 'dots', gradient: 'primary' },
    },
  },
  {
    name: 'Twitch', hex: '#9146FF', label: '直播娱乐',
    designConfig: {
      typography: { weightStyle: 'bold' },
      shape: { radius: 'lg' },
      elevation: { style: 'dramatic', separator: 'shadow' },
      components: { buttonShape: 'pill', cardStyle: 'glass' },
      motion: { hoverEffect: 'glow', cardHover: 'glow' },
      visualStyle: { decorative: 'gradient-blob', gradient: 'spectrum' },
    },
  },
  {
    name: 'Supabase', hex: '#3ECF8E', label: '开源后端',
    designConfig: {
      shape: { radius: 'lg', borderStyle: 'subtle' },
      elevation: { style: 'subtle', separator: 'shadow' },
      components: { cardStyle: 'bordered' },
      motion: { hoverEffect: 'opacity', cardHover: 'lift' },
      visualStyle: { decorative: 'grid-lines', gradient: 'primary' },
    },
  },
]

export const FONT_PRESETS: FontPreset[] = [
  { name: 'Inter', googleName: 'Inter', label: 'SaaS / 工具标配', fallback: 'system-ui, sans-serif' },
  { name: 'DM Sans', googleName: 'DM+Sans', label: '医疗 / 温和感', fallback: 'system-ui, sans-serif' },
  { name: 'Space Grotesk', googleName: 'Space+Grotesk', label: 'Crypto / 科技感', fallback: 'system-ui, sans-serif' },
  { name: 'Nunito', googleName: 'Nunito', label: '消费 / 活泼感', fallback: 'system-ui, sans-serif' },
  { name: 'IBM Plex Sans', googleName: 'IBM+Plex+Sans', label: '企业 / 严肃感', fallback: 'system-ui, sans-serif' },
  { name: 'Fraunces', googleName: 'Fraunces', label: '编辑 / 内容为王', fallback: 'Georgia, serif' },
  { name: 'Plus Jakarta Sans', googleName: 'Plus+Jakarta+Sans', label: '现代几何 / 干净', fallback: 'system-ui, sans-serif' },
  { name: 'Outfit', googleName: 'Outfit', label: '圆润几何 / 友好', fallback: 'system-ui, sans-serif' },
  { name: 'Manrope', googleName: 'Manrope', label: '科技 / 高可读', fallback: 'system-ui, sans-serif' },
  { name: 'Poppins', googleName: 'Poppins', label: '印度几何 / 流行', fallback: 'system-ui, sans-serif' },
  { name: 'Raleway', googleName: 'Raleway', label: '优雅 / 时尚品牌', fallback: 'system-ui, sans-serif' },
  { name: 'Sora', googleName: 'Sora', label: 'Web3 / 未来感', fallback: 'system-ui, sans-serif' },
  { name: 'Geist', googleName: 'Geist', label: 'Vercel 风格', fallback: 'system-ui, sans-serif' },
  { name: 'Lora', googleName: 'Lora', label: '衬线 / 文学杂志', fallback: 'Georgia, serif' },
  { name: 'Playfair Display', googleName: 'Playfair+Display', label: '衬线 / 奢侈品牌', fallback: 'Georgia, serif' },
  { name: 'Source Sans 3', googleName: 'Source+Sans+3', label: 'Adobe / 长文阅读', fallback: 'system-ui, sans-serif' },
]

export type PageType = 'landing' | 'ecommerce' | 'dashboard' | 'portfolio' | 'blog' | 'pricing' | 'login'

export const PAGE_TYPES: { key: PageType; label: string; desc: string }[] = [
  { key: 'landing', label: '公司官网', desc: 'Hero + 特性 + CTA，等间距段落' },
  { key: 'ecommerce', label: '电商平台', desc: '商品网格 + 购物车，紧凑密集' },
  { key: 'dashboard', label: 'SaaS 仪表板', desc: '侧栏 + 数据面板，功能导向' },
  { key: 'pricing', label: '定价页', desc: '三栏对比 + 功能表，转化导向' },
  { key: 'blog', label: '博客 / 内容', desc: '窄幅单栏 + 侧边栏，阅读优先' },
  { key: 'login', label: '登录 / 注册', desc: '居中卡片 + 社交登录，极简表单' },
  { key: 'portfolio', label: '作品集', desc: 'Bento 网格 + 大留白，图片主导' },
]
