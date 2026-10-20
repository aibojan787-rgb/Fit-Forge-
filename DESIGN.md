# DESIGN

## Product
Web app for custom clothing. The user is the buyer.

Flow:
1. Login (first screen)
2. Tutorial on how to measure your body
3. Style questionnaire: a series of questions where the user picks their clothing style
4. Upload 6 photos of yourself, from which a personal 3D AI model is created
5. Main app: outfit suggestions the user can buy and wear
6. Every piece the user selects is shown on their 3D model, so they can see how it fits on them

## Users
- Everyone over 12, but most users are 20 to 50
- Desktop and phone are used equally, so every screen must work well at 375 px and 1440 px

## Tone
Elegant, fast, intuitive, light.

## Visuals

### Colors
- Background: white
- Accents: navy, beige, brick red
- Navy is the primary color (main buttons, headings, active states)
- Beige is for secondary surfaces and soft sections
- Brick red is used sparingly (sale, important actions, small highlights)

| Role       | Color     | Hex       |
|------------|-----------|-----------|
| Background | White     | `#FFFFFF` |
| Primary    | Navy      | `#1B2A49` |
| Secondary  | Beige     | `#E8DCC8` |
| Accent     | Brick red | `#B5483A` |
| Text       | Dark navy | `#111827` |

### Fonts
- Headings: Cormorant Garamond
- Body and UI: Inter

### Shapes
Rounded corners everywhere (buttons, inputs, cards, images).

### Images
- Real-life clothing models, no illustrations
- Men's clothing on men, women's clothing on women

### Icons
`lucide-react` only.

## Reference
`docs/ref`

## Don't
- Gradients without a reason, emoji instead of icons, a "Welcome to…" hero
- Everything in cards with shadows
- Icons from any library other than `lucide-react`
- Sharp corners
- Showing men's clothing on women or women's clothing on men