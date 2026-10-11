/**
 * Generator script to create KET word level files (level-01.js to level-12.js)
 * This script runs in node as CommonJS.
 */

const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '../src/data/ket-words');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Complete KET word list definition by level
const levelsData = {
  1: {
    animals: [
      ['cat', '/kæt/', '猫咪', 'Cat', 'The cat is sleeping on the sofa.', '猫咪正在沙发上睡觉。'],
      ['dog', '/dɒɡ/', '小狗', 'Dog', 'The dog is barking at the ball.', '小狗正对着皮球叫。'],
      ['bird', '/bɜːd/', '小鸟', 'Bird', 'A blue bird is singing in the tree.', '一只蓝色的小鸟正在树上唱歌。'],
      ['fish', '/fɪʃ/', '小鱼', 'Fish', 'Three little fish swim in the water.', '三只小鱼在水里游。'],
      ['horse', '/hɔːs/', '马', 'Sparkles', 'The brown horse runs very fast.', '棕色的马跑得很快。'],
      ['monkey', '/ˈmʌŋki/', '猴子', 'Sparkles', 'The funny monkey loves sweet bananas.', '滑稽的猴子喜欢甜香蕉。'],
      ['rabbit', '/ˈræbɪt/', '兔子', 'Rabbit', 'The white rabbit has long ears.', '白兔有一对长耳朵。'],
      ['snake', '/sneɪk/', '蛇', 'Sparkles', 'The green snake climbs the tree.', '绿色的蛇爬上了树。'],
      ['spider', '/ˈspaɪdə(r)/', '蜘蛛', 'Bug', 'A black spider is on the wall.', '墙上有一只黑蜘蛛。'],
      ['tiger', '/ˈtaɪɡə(r)/', '老虎', 'Sparkles', 'The big tiger has orange stripes.', '大老虎有橙色的条纹。'],
      ['elephant', '/ˈelɪfənt/', '大象', 'Sparkles', 'The elephant has a very long nose.', '大象有一只长鼻子。'],
      ['bear', '/beə(r)/', '熊', 'Sparkles', 'The brown bear is sleeping in the cave.', '棕熊正在洞穴里睡觉。'],
      ['duck', '/dʌk/', '鸭子', 'Bird', 'The little yellow duck swims in the pond.', '小黄鸭在池塘里游水。'],
      ['frog', '/frɒɡ/', '青蛙', 'Sparkles', 'A green frog is jumping on the leaf.', '一只绿青蛙在叶子上跳跃。'],
      ['chicken', '/ˈtʃɪkɪn/', '鸡', 'Bird', 'The baby chicken is very small and yellow.', '小鸡仔又小又黄，很可爱。'],
      ['cow', '/kaʊ/', '奶牛', 'Sparkles', 'The cow eats fresh green grass.', '奶牛吃新鲜的绿草。'],
      ['sheep', '/ʃiːp/', '绵羊', 'Sparkles', 'The white sheep looks like a cloud.', '白色的绵羊看起来像一朵云。'],
      ['mouse', '/maʊs/', '老鼠', 'Sparkles', 'The little mouse runs into the hole.', '小老鼠跑进了洞里。'],
      ['lion', '/ˈlaɪən/', '狮子', 'Sparkles', 'The brave lion is the king of the forest.', '勇敢的狮子是森林之王。'],
      ['panda', '/ˈpændə/', '熊猫', 'Sparkles', 'The cute panda is eating bamboo.', '可爱的熊猫正在吃竹子。'],
      ['pet', '/pet/', '宠物', 'Heart', 'I love my little pet dog.', '我爱我的宠物小狗。']
    ],
    colors: [
      ['red', '/red/', '红色', 'Heart', 'I have a red apple.', '我有一个红苹果。'],
      ['blue', '/bluː/', '蓝色', 'Cloud', 'The beautiful sky is blue.', '美丽的天空是蓝色的。'],
      ['green', '/ɡriːn/', '绿色', 'Leaf', 'The grass is soft and green.', '草地又软又绿。'],
      ['yellow', '/ˈjeləʊ/', '黄色', 'Sun', 'The warm sun is yellow.', '温暖的太阳是黄色的。'],
      ['orange', '/ˈɒrɪndʒ/', '橙色', 'Apple', 'Orange is my favorite color.', '橙色是我最喜欢的颜色。'],
      ['purple', '/ˈpɜːpl/', '紫色', 'Palette', 'My mother bought a purple grape.', '妈妈买了一颗紫色的葡萄。'],
      ['pink', '/pɪŋk/', '粉红色', 'Heart', 'The little girl wears a pink dress.', '小女孩穿着粉红色的连衣裙。'],
      ['black', '/blæk/', '黑色', 'Sparkles', 'A black cat runs across the street.', '一只黑猫跑过街道。'],
      ['white', '/waɪt/', '白色', 'Cloud', 'The snow is pure white.', '雪是纯白色的。'],
      ['brown', '/braʊn/', '棕色', 'Palette', 'The teddy bear is soft and brown.', '泰迪熊又软又棕。']
    ],
    numbers: [
      ['one', '/wʌn/', '一', 'Hash', 'I have one nose.', '我有一只鼻子。'],
      ['two', '/tuː/', '二', 'Hash', 'I have two eyes.', '我有两只眼睛。'],
      ['three', '/θriː/', '三', 'Hash', 'There are three apples on the table.', '桌子上有三个苹果。'],
      ['four', '/fɔː(r)/', '四', 'Hash', 'A dog has four legs.', '小狗有四条腿。'],
      ['five', '/faɪv/', '五', 'Hash', 'I have five fingers on my hand.', '我一只手有五个手指。'],
      ['six', '/sɪks/', '六', 'Hash', 'She has six colorful pencils.', '她有六支彩色的铅笔。'],
      ['seven', '/ˈsevn/', '七', 'Hash', 'A week has seven days.', '一个星期有七天。'],
      ['eight', '/eɪt/', '八', 'Hash', 'An octopus has eight arms.', '章鱼有八只手。'],
      ['nine', '/naɪn/', '九', 'Hash', 'There are nine birds in the sky.', '天空中飞着九只鸟。'],
      ['ten', '/ten/', '十', 'Hash', 'I can count from one to ten.', '我能从一数到十。'],
      ['zero', '/ˈzɪərəʊ/', '零', 'Hash', 'Zero comes before one.', '零在一步之前。']
    ],
    family: [
      ['mother', '/ˈmʌðə(r)/', '妈妈', 'Smile', 'My mother reads to me every night.', '我妈妈每天晚上给我读书。'],
      ['father', '/ˈfɑːðə(r)/', '爸爸', 'UserCircle', 'My father takes me to the park.', '我爸爸带我去公园。'],
      ['sister', '/ˈsɪstə(r)/', '姐姐/妹妹', 'UserCircle', 'My sister is very nice to me.', '我姐姐/妹妹对我非常好。'],
      ['brother', '/ˈbrʌðə(r)/', '哥哥/弟弟', 'UserCircle', 'My baby brother likes to play with toys.', '我小弟弟喜欢玩玩具。'],
      ['baby', '/ˈbeɪbi/', '宝宝', 'Baby', 'The little baby is sleeping.', '小宝宝正在睡觉。'],
      ['parent', '/ˈpeərənt/', '双亲之一', 'Users', 'Every parent loves their child.', '每个父母都爱他们的孩子。'],
      ['son', '/sʌn/', '儿子', 'UserCircle', 'He is the only son in the family.', '他是家里唯一的儿子。'],
      ['daughter', '/ˈdɔːtə(r)/', '女儿', 'UserCircle', 'She is a loving daughter.', '她是一个贴心的女儿。'],
      ['grandmother', '/ˈɡrænmʌðə(r)/', '奶奶/外婆', 'Smile', 'My grandmother makes delicious cookies.', '我奶奶/外婆做的饼干很好吃。'],
      ['grandfather', '/ˈɡrænfɑːðə(r)/', '爷爷/外公', 'UserCircle', 'My grandfather tells funny stories.', '我爷爷/外公讲有趣的故事。'],
      ['friend', '/frend/', '朋友', 'HeartHandshake', 'We are good friends.', '我们是好朋友。'],
      ['child', '/tʃaɪld/', '儿童', 'UserCircle', 'The happy child is laughing.', '快乐的孩子正在笑。'],
      ['boy', '/bɔɪ/', '男孩', 'UserCircle', 'The boy plays football.', '男孩踢足球。'],
      ['girl', '/ɡɜːl/', '女孩', 'UserCircle', 'The little girl is drawing a flower.', '小女孩正在画一朵花。'],
      ['family', '/ˈfæməli/', '家庭', 'Users', 'I love my warm family.', '我爱我温暖的家。']
    ]
  },
  2: {
    food: [
      ['apple', '/ˈæpl/', '苹果', 'Apple', 'The red apple is very sweet.', '红苹果非常甜。'],
      ['banana', '/bəˈnɑːnə/', '香蕉', 'Banana', 'The monkey eats a yellow banana.', '猴子吃了一根黄香蕉。'],
      ['bread', '/bred/', '面包', 'Croissant', 'I eat bread for breakfast.', '我早餐吃面包。'],
      ['butter', '/ˈbʌtə(r)/', '黄油', 'Sparkles', 'Please put some butter on the bread.', '请在面包上抹点黄油。'],
      ['cake', '/keɪk/', '蛋糕', 'Cake', 'We have a big chocolate cake for birthday.', '我们生日吃大巧克力蛋糕。'],
      ['cheese', '/tʃiːz/', '奶酪', 'Sparkles', 'The little mouse loves cheese.', '小老鼠最喜欢奶酪。'],
      ['chocolate', '/ˈtʃɒklət/', '巧克力', 'Candy', 'Chocolate is sweet and delicious.', '巧克力又甜又好吃。'],
      ['egg', '/eɡ/', '鸡蛋', 'Egg', 'A bird comes out of the egg.', '一只鸟从蛋里孵出来。'],
      ['grape', '/ɡreɪp/', '葡萄', 'Grape', 'The purple grapes are juicy.', '紫色的葡萄多汁。'],
      ['hamburger', '/ˈhæmbɜːɡə(r)/', '汉堡包', 'Pizza', 'Tom likes eating hamburgers.', '汤姆喜欢吃汉堡包。'],
      ['ice cream', '/ˌaɪs ˈkriːm/', '冰淇淋', 'IceCream', 'I love cold strawberry ice cream.', '我喜欢冰凉的草莓冰淇淋。'],
      ['juice', '/dʒuːs/', '果汁', 'GlassWater', 'I want a glass of orange juice.', '我想要一杯橙汁。'],
      ['milk', '/mɪlk/', '牛奶', 'GlassWater', 'We drink fresh milk every day.', '我们每天喝新鲜牛奶。'],
      ['orange', '/ˈɒrɪndʒ/', '橙子', 'Apple', 'This orange has sweet juice.', '这个橙子汁很甜。'],
      ['pear', '/peə(r)/', '梨', 'Apple', 'The yellow pear is very soft.', '黄色的梨非常软。'],
      ['pizza', '/ˈpiːtsə/', '比萨饼', 'Pizza', 'Let\'s order a big cheese pizza.', '我们订个大奶酪披萨吧。'],
      ['potato', '/pəˈteɪtəʊ/', '土豆', 'Sparkles', 'We can make French fries with potato.', '我们可以用土豆做薯条。'],
      ['rice', '/raɪs/', '米饭', 'Soup', 'I eat hot rice with vegetables.', '我配蔬菜吃热腾腾的米饭。'],
      ['salad', '/ˈsæləd/', '沙拉', 'Salad', 'This green salad is very fresh.', '这份蔬菜沙拉非常新鲜。'],
      ['salt', '/sɔːlt/', '食盐', 'Sparkles', 'Do not put too much salt in the soup.', '汤里不要放太多盐。'],
      ['sandwich', '/ˈsænwɪdʒ/', '三明治', 'Sandwich', 'I have a ham and cheese sandwich.', '我吃火腿奶酪三明治。'],
      ['soup', '/suːp/', '汤', 'Soup', 'The chicken soup is warm and good.', '鸡汤又热又好喝。'],
      ['tea', '/tiː/', '茶', 'Coffee', 'Grandpa drinks warm tea.', '爷爷喝热茶。'],
      ['tomato', '/təˈmɑːtəʊ/', '西红柿', 'Sparkles', 'The red tomato is round and cute.', '红西红柿又圆又可爱。'],
      ['vegetable', '/ˈvedʒtəbl/', '蔬菜', 'Salad', 'Eating vegetables makes us healthy.', '吃蔬菜让我们身体健康。'],
      ['water', '/ˈwɔːtə(r)/', '水', 'GlassWater', 'Drinking clean water is good for us.', '喝干净的水对我们有好处。'],
      ['breakfast', '/ˈbrekfəst/', '早餐', 'Egg', 'We eat breakfast in the morning.', '我们在早上吃早餐。'],
      ['lunch', '/lʌntʃ/', '午餐', 'Sandwich', 'What is for lunch today?', '今天中午吃什么？'],
      ['dinner', '/ˈdɪnə(r)/', '晚餐', 'Soup', 'We sit together for family dinner.', '我们坐在一起吃家宴晚餐。'],
      ['hungry', '/ˈhʌŋɡri/', '饥饿的', 'Smile', 'The little boy is hungry.', '这个小男孩饿了。']
    ],
    body: [
      ['arm', '/ɑːm/', '手臂', 'User', 'I have two strong arms.', '我有两只强壮的手臂。'],
      ['ear', '/ɪə(r)/', '耳朵', 'Ear', 'We listen with our ears.', '我们用耳朵听声音。'],
      ['eye', '/aɪ/', '眼睛', 'Eye', 'My eyes are bright.', '我的眼睛很明亮。'],
      ['face', '/feɪs/', '脸', 'Smile', 'Wash your face in the morning.', '早上洗脸。'],
      ['finger', '/ˈfɪŋɡə(r)/', '手指', 'Hand', 'I point to the star with my finger.', '我用手指指着星星。'],
      ['foot', '/fʊt/', '脚', 'Footprints', 'Put your shoe on your foot.', '把鞋子穿在脚上。'],
      ['hair', '/heə(r)/', '头发', 'UserCircle', 'Her hair is long and brown.', '她的头发又长又棕。'],
      ['hand', '/hænd/', '手', 'Hand', 'Hold my hand to cross the street.', '牵着我的手过马路。'],
      ['head', '/hed/', '头部', 'UserCircle', 'Wear a warm hat on your head.', '头上戴一顶温暖的帽子。'],
      ['heart', '/hɑːt/', '心脏', 'Heart', 'My heart goes thump thump.', '我的心跳扑通扑通响。'],
      ['leg', '/leɡ/', '腿', 'UserCircle', 'A horse has four long legs.', '马有四条长腿。'],
      ['mouth', '/maʊs/', '嘴巴', 'Smile', 'Open your mouth and sing along.', '张开嘴巴，跟着唱。'],
      ['nose', '/nəʊz/', '鼻子', 'UserCircle', 'I smell flowers with my nose.', '我用鼻子闻花香。'],
      ['teeth', '/tiːθ/', '牙齿', 'Smile', 'Brush your teeth twice a day.', '一天刷两次牙。'],
      ['tongue', '/tʌŋ/', '舌头', 'Smile', 'The snake has a long tongue.', '蛇有长长的舌头。'],
      ['brain', '/breɪn/', '大脑', 'Brain', 'Our brain helps us think.', '我们的大脑帮助我们思考。']
    ],
    clothes: [
      ['bag', '/bæɡ/', '包', 'ShoppingBag', 'I put my books in the school bag.', '我把书放进书包里。'],
      ['coat', '/kəʊt/', '外套', 'Shirt', 'Put on a warm coat in winter.', '冬天穿上一件暖和的外套。'],
      ['dress', '/dres/', '连衣裙', 'Shirt', 'She has a pretty pink dress.', '她有一条粉红色的漂亮连衣裙。'],
      ['glasses', '/ˈɡlɑːsɪz/', '眼镜', 'Glasses', 'Grandpa wears glasses to read.', '爷爷戴着眼镜看书。'],
      ['glove', '/ɡlʌv/', '手套', 'Hand', 'My warm gloves are red.', '我温暖的手套是红色的。'],
      ['hat', '/hæt/', '帽子', 'Crown', 'The sun hat keeps the light away.', '太阳帽可以遮挡阳光。'],
      ['jacket', '/ˈdʒækɪt/', '夹克', 'Shirt', 'This blue jacket is cool.', '这件蓝色外套很酷。'],
      ['jeans', '/dʒiːnz/', '牛仔裤', 'Shirt', 'My brother likes to wear blue jeans.', '我哥哥喜欢穿蓝牛仔裤。'],
      ['pocket', '/ˈpɒkɪt/', '口袋', 'Shirt', 'I have a little key in my pocket.', '我口袋里有一把小钥匙。'],
      ['scarf', '/skɑːf/', '围巾', 'Shirt', 'A wool scarf keeps my neck warm.', '羊毛围巾让我的脖子保持暖和。'],
      ['shirt', '/ʃɜːt/', '衬衫', 'Shirt', 'My father wears a clean white shirt.', '我父亲穿着一件干净的白衬衫。'],
      ['shoe', '/ʃuː/', '鞋子', 'Footprints', 'Tie your shoes before running.', '跑前系好鞋带。'],
      ['skirt', '/skɜːt/', '短裙', 'Shirt', 'The green skirt is very short.', '这条绿裙子很短。'],
      ['sock', '/sɒk/', '袜子', 'Shirt', 'Put on clean socks every day.', '每天穿干净的袜子。'],
      ['suit', '/suːt/', '西装', 'Shirt', 'The businessman wears a smart suit.', '这位商人穿着一套帅气的西服。'],
      ['sweater', '/ˈswetə(r)/', '毛衣', 'Shirt', 'My grandmother knitted this warm sweater.', '我奶奶织了这件温暖的毛衣。'],
      ['tie', '/taɪ/', '领带', 'Shirt', 'He wears a red tie with the suit.', '他穿西装系红领带。'],
      ['watch', '/wɒtʃ/', '手表', 'Watch', 'The silver watch shows the time.', '银色手表显示时间。']
    ]
  },
  3: {
    house: [
      ['apartment', '/əˈpɑːtmənt/', '公寓', 'Home', 'We live in a tall apartment building.', '我们住在一栋高高的公寓大楼里。'],
      ['bathroom', '/ˈbɑːθruːm/', '浴室', 'Bath', 'I wash my hands in the bathroom.', '我在浴室里洗手。'],
      ['bedroom', '/ˈbedruːm/', '卧室', 'Bed', 'My bedroom has a small bed and desk.', '我的卧室有一张小床和书桌。'],
      ['door', '/dɔː(r)/', '门', 'DoorOpen', 'Please open the door for guest.', '请为客人开门。'],
      ['floor', '/flɔː(r)/', '地板/楼层', 'Home', 'The floor is clean and smooth.', '地板又干净又光滑。'],
      ['garage', '/ˈɡærɑːʒ/', '车库', 'Home', 'Dad parked the car in the garage.', '爸爸把车停在车库里。'],
      ['garden', '/ˈɡɑːdn/', '花园', 'Flower', 'There are many red flowers in the garden.', '花园里有许多红花。'],
      ['gate', '/ɡeɪt/', '大门', 'DoorClosed', 'Close the garden gate, please.', '请关上花园大门。'],
      ['hall', '/hɔːl/', '大厅', 'Home', 'Hang your coat in the entrance hall.', '把外套挂在玄关大厅。'],
      ['home', '/həʊm/', '家', 'Home', 'My home is full of love.', '我的家充满了爱。'],
      ['house', '/haʊs/', '房子', 'Home', 'They live in a little house with red roof.', '他们住在一栋红屋顶的小房子里。'],
      ['kitchen', '/ˈkɪtʃɪn/', '厨房', 'UtensilsCrossed', 'Mother cooks soup in the kitchen.', '妈妈在厨房里煮汤。'],
      ['living room', '/ˈlɪvɪŋ ruːm/', '客厅', 'Sofa', 'We watch TV in the living room.', '我们在客厅看电视。'],
      ['mirror', '/ˈmɪrə(r)/', '镜子', 'Smile', 'Look at yourself in the mirror.', '照照镜子里的你自己。'],
      ['roof', '/ruːf/', '屋顶', 'Home', 'Birds are sitting on the red roof.', '鸟儿正停在红屋顶上。'],
      ['room', '/ruːm/', '房间', 'Home', 'Keep your room tidy and clean.', '让你的房间保持干净整洁。'],
      ['shower', '/ˈʃaʊə(r)/', '淋浴', 'Bath', 'I take a warm shower before bed.', '我睡前洗个温水澡。'],
      ['wall', '/wɔːl/', '墙壁', 'Home', 'There is a map on the wall.', '墙上挂着一张地图。'],
      ['window', '/ˈwɪndəʊ/', '窗户', 'DoorOpen', 'Look out of the window to see birds.', '往窗外看能看到鸟儿。'],
      ['key', '/kiː/', '钥匙', 'Key', 'I open the front door with a key.', '我用钥匙开前门。']
    ],
    furniture: [
      ['bath', '/bɑːθ/', '浴缸', 'Bath', 'The white bath is full of hot water.', '白浴缸里装满了热水。'],
      ['bed', '/bed/', '床', 'Bed', 'The bed is soft and warm.', '床又软又暖。'],
      ['blanket', '/ˈbæŋkɪt/', '毛毯', 'Bed', 'Cover yourself with a wool blanket.', '盖上一条羊毛毯子。'],
      ['chair', '/tʃeə(r)/', '椅子', 'Armchair', 'Sit down on this wooden chair.', '坐在这张木椅上。'],
      ['clock', '/klɒk/', '时钟', 'Clock', 'The clock on the wall goes tick-tock.', '墙上的时钟滴答滴答响。'],
      ['cupboard', '/ˈkʌbəd/', '碗橱', 'Home', 'Put the clean plates in the cupboard.', '把干净的盘子放进橱柜里。'],
      ['desk', '/desk/', '书桌', 'Table2', 'I study at my little desk.', '我在我的小书桌前学习。'],
      ['fridge', '/frɪdʒ/', '冰箱', 'Refrigerator', 'Put the fresh milk in the fridge.', '把新鲜牛奶放进冰箱。'],
      ['lamp', '/læmp/', '台灯', 'Lamp', 'Turn on the desk lamp to read.', '开台灯看书。'],
      ['shelf', '/ʃelf/', '搁板/书架', 'Book', 'The book is on the top shelf.', '书在最上面的架子上。'],
      ['sofa', '/ˈsəʊfə/', '沙发', 'Sofa', 'We sit on the soft sofa together.', '我们一起坐在松软的沙发上。'],
      ['table', '/ˈteɪbl/', '桌子', 'Table2', 'Put the soup bowl on the table.', '把汤碗放在桌子上。'],
      ['towel', '/ˈtaʊəl/', '毛巾', 'Bath', 'Dry your hands with a clean towel.', '用干净的毛巾擦干手。'],
      ['plug', '/plʌɡ/', '插头', 'Plug', 'Do not touch the electrical plug.', '不要触碰电源插头。']
    ],
    daily_items: [
      ['bottle', '/ˈbɒtl/', '瓶子', 'GlassWater', 'There is some fresh water in the bottle.', '瓶子里有些新鲜水。'],
      ['box', '/bɒks/', '盒子', 'Package', 'Put the toy bricks in the wood box.', '把积木放进木盒子里。'],
      ['bowl', '/bəʊl/', '碗', 'Soup', 'I eat cereal from a big red bowl.', '我用一个红色大碗吃麦片。'],
      ['camera', '/ˈkæmərə/', '照相机', 'Camera', 'Let\'s take a picture with my camera.', '让我们用照相机拍张照吧。'],
      ['card', '/kɑːd/', '卡片', 'FileText', 'Send a birthday card to your friend.', '给你的朋友寄一张生日卡片。'],
      ['cup', '/kʌp/', '杯子', 'Coffee', 'I want a cup of hot milk.', '我想要一杯热牛奶。'],
      ['fork', '/fɔːk/', '叉子', 'UtensilsCrossed', 'Use a fork to eat salad.', '用叉子吃沙拉。'],
      ['glass', '/ɡlɑːs/', '玻璃杯', 'GlassWater', 'A glass of apple juice, please.', '请给我一杯苹果汁。'],
      ['knife', '/naɪf/', '小刀', 'UtensilsCrossed', 'The bread knife is very sharp.', '这把面包刀非常锋利。'],
      ['map', '/mæp/', '地图', 'Map', 'We look at the map to find our way.', '我们看地图找路。'],
      ['notebook', '/ˈnəʊtbʊk/', '笔记本', 'Notebook', 'I write English words in my notebook.', '我在笔记本里写英文单词。'],
      ['paper', '/ˈpeɪpə(r)/', '纸张', 'FileText', 'Draw a puppy on the white paper.', '在白纸上画一只小狗。'],
      ['pen', '/pen/', '钢笔', 'Pencil', 'Write your name with a blue pen.', '用蓝色钢笔写你的名字。'],
      ['pencil', '/ˈpensl/', '铅笔', 'Pencil', 'I sharpen my yellow pencil.', '我削我的黄色铅笔。'],
      ['plate', '/pleɪt/', '盘子', 'UtensilsCrossed', 'Put the sandwich on the small plate.', '把三明治放在小盘子里。'],
      ['purse', '/pɜːs/', '钱包(女式)', 'Wallet', 'Mother has some coins in her purse.', '妈妈的钱包里有一些硬币。'],
      ['scissors', '/ˈsɪzəz/', '剪刀', 'Scissors', 'Do not play with sharp scissors.', '不要玩锋利的剪刀。'],
      ['soap', '/səʊp/', '肥皂', 'Bath', 'Wash your hands with warm water and soap.', '用温水和肥皂洗手。'],
      ['spoon', '/spuːn/', '勺子', 'UtensilsCrossed', 'Eat your warm soup with a spoon.', '用勺子喝热汤。'],
      ['toy', '/tɔɪ/', '玩具', 'Sparkles', 'The toy train runs on the track.', '玩具小火车在轨道上跑。']
    ]
  },
  4: {
    school: [
      ['answer', '/ˈɑːnsə(r)/', '回答', 'MessageCircle', 'Can you answer this question?', '你能回答这个问题吗？'],
      ['board', '/bɔːd/', '黑板', 'Monitor', 'The teacher writes words on the board.', '老师在黑板上写字。'],
      ['class', '/klɑːs/', '班级/课程', 'Users', 'I sit in the English class.', '我坐在英语课堂上。'],
      ['classroom', '/ˈklɑːsruːm/', '教室', 'Home', 'Our classroom is clean and bright.', '我们的教室干净明亮。'],
      ['club', '/klʌb/', '俱乐部', 'Users', 'I joined the school chess club.', '我加入了学校的国际象棋社。'],
      ['course', '/kɔːs/', '课程', 'BookOpen', 'The online course is very interesting.', '网课非常有趣。'],
      ['dictionary', '/ˈdɪkʃənri/', '词典', 'Book', 'Look up the word in the dictionary.', '在词典里查这个单词。'],
      ['eraser', '/ɪˈreɪzə(r)/', '橡皮擦', 'Pencil', 'Use an eraser to clean the page.', '用橡皮擦把书页擦干净。'],
      ['exam', '/ɪɡˈzæm/', '考试', 'FileText', 'We have an English exam tomorrow.', '我们明天有英语考试。'],
      ['homework', '/ˈhəʊmwɜːk/', '家庭作业', 'Notebook', 'Do your homework before dinner.', '晚饭前做好功课。'],
      ['learn', '/lɜːn/', '学习', 'GraduationCap', 'We learn many new words here.', '我们在这里学了许多新单词。'],
      ['lesson', '/ˈlesn/', '课', 'BookOpen', 'The music lesson starts at nine.', '音乐课九点钟开始。'],
      ['library', '/ˈlaɪbrəri/', '图书馆', 'BookOpen', 'Quiet please in the school library.', '学校图书馆里请保持安静。'],
      ['mistake', '/mɪˈsteɪk/', '错误', 'AlertCircle', 'Do not worry about making a mistake.', '别担心犯错。'],
      ['page', '/peɪdʒ/', '书页', 'FileText', 'Open the book to page ten.', '翻开书到第十页。'],
      ['playground', '/ˈpleɪɡraʊnd/', '操场', 'Sparkles', 'Kids run happily on the playground.', '孩子们在操场上快乐地奔跑。'],
      ['pupil', '/ˈpjuːpl/', '小学生', 'UserCircle', 'The young pupil is listening carefully.', '这个小学生正在认真听讲。'],
      ['question', '/ˈkwestʃən/', '问题', 'HelpCircle', 'I have a simple question to ask.', '我有一个简单的问题要问。'],
      ['school', '/skuːl/', '学校', 'School', 'I walk to school every morning.', '我每天早上走路去上学。'],
      ['student', '/ˈstjuːdnt/', '学生', 'UserCircle', 'The student is reading a book.', '学生正在看书。'],
      ['teacher', '/ˈtiːtʃə(r)/', '老师', 'UserCircle', 'Our English teacher is very nice.', '我们的英语老师非常好。'],
      ['test', '/test/', '测试', 'FileText', 'We have a spelling test today.', 'We have a spelling test today.'],
      ['write', '/raɪt/', '写字', 'Pencil', 'Write your name on the paper.', '在纸上写上你的名字。']
    ],
    subjects: [
      ['art', '/ɑːt/', '美术', 'Palette', 'Art class is very colorful.', '美术课色彩丰富。'],
      ['biology', '/baɪˈɒlədʒi/', '生物', 'Activity', 'Biology is the study of life.', '生物学是研究生命的学科。'],
      ['chemistry', '/ˈkemɪstri/', '化学', 'FlaskConical', 'Chemistry tests are fun.', '化学实验很有意思。'],
      ['English', '/ˈɪŋɡlɪʃ/', '英语', 'Globe', 'I like speaking English with Sparks.', '我喜欢和 Sparks 说英语。'],
      ['geography', '/dʒiˈɒɡrəfi/', '地理', 'Globe', 'We learn about mountains in geography.', '我们在地理课上了解大山。'],
      ['history', '/ˈhɪstri/', '历史', 'Calendar', 'History teaches us about the past.', '历史向我们讲述过去。'],
      ['maths', '/mæθs/', '数学', 'Calculator', 'I solve number puzzles in maths.', '我在数学课上解数字谜题。'],
      ['music', '/ˈmjuːzɪk/', '音乐', 'Music', 'I play the little drum in music.', '我在音乐课上敲小鼓。'],
      ['science', '/ˈsaɪəns/', '科学', 'FlaskConical', 'Science helps us understand nature.', '科学帮助我们理解自然。'],
      ['sport', '/spɔːt/', '体育', 'Trophy', 'PE is my favorite sport lesson.', '体育课是我最喜欢的运动课。']
    ],
    time: [
      ['afternoon', '/ˌɑːftəˈnuːn/', '下午', 'Sun', 'Good afternoon, Mum and Dad!', '爸爸妈妈，下午好！'],
      ['birthday', '/ˈbɜːθdeɪ/', '生日', 'Gift', 'I have a big party on my birthday.', '我生日那天有个大派对。'],
      ['calendar', '/ˈkælɪndə(r)/', '日历', 'Calendar', 'Mark the birthday on the calendar.', '在日历上标出出生的日期。'],
      ['clock', '/klɒk/', '钟', 'Clock', 'The kitchen clock shows twelve.', '厨房的钟指向十二点。'],
      ['date', '/deɪt/', '日期', 'Calendar', 'What is the date today?', '今天是几号？'],
      ['day', '/deɪt/', '天/白天', 'Sun', 'There are seven days in a week.', '一星期有七天。'],
      ['evening', '/ˈiːvnɪŋ/', '傍晚/晚上', 'Cloud', 'We watch stars in the evening.', '我们在晚上看星星。'],
      ['future', '/ˈfjuːtʃə(r)/', '未来', 'Rocket', 'Robots will help us in the future.', '机器人在未来会帮助我们。'],
      ['hour', '/ˈaʊə(r)/', '小时', 'Clock', 'An hour has sixty minutes.', '一小时有六十分钟。'],
      ['minute', '/ˈmɪnɪt/', '分钟', 'Clock', 'Wait for one minute, please.', '请等一分钟。'],
      ['month', '/mʌnθ/', '月份', 'Calendar', 'A year has twelve months.', '一年有十二个月。'],
      ['morning', '/ˈmɔːnɪŋ/', '早上', 'Sun', 'Good morning, Sparks!', '早安，Sparks！'],
      ['never', '/ˈnevə(r)/', '从不', 'AlertCircle', 'I never sleep with my shoes on.', '我从不穿鞋睡觉。'],
      ['night', '/naɪt/', '夜晚', 'Cloud', 'Stars are bright at night.', '夜里星星很亮。'],
      ['noon', '/nuːn/', '中午', 'Sun', 'We eat lunch at noon.', '我们中午吃午餐。'],
      ['now', '/naʊ/', '现在', 'Clock', 'Come here right now, please.', '现在请立刻过来。'],
      ['season', '/ˈsiːzn/', '季节', 'Leaf', 'My favorite season is spring.', '我最喜欢的季节是春天。'],
      ['second', '/ˈsekənd/', '秒', 'Clock', 'Count to three in three seconds.', '三秒钟数到三。'],
      ['sometimes', '/ˈsʌmtaɪmz/', '有时', 'Clock', 'Sometimes we walk to the library.', '有时我们走路去图书馆。'],
      ['time', '/taɪm/', '时间', 'Clock', 'What time is it now?', '现在是几点？'],
      ['today', '/təˈdeɪ/', '今天', 'Sun', 'Today is a sunny day.', '今天是个晴天。'],
      ['tomorrow', '/təˈmɒrəʊ/', '明天', 'Calendar', 'Tomorrow is my birthday.', '明天是我的生日。'],
      ['week', '/wiːk/', '星期', 'Calendar', 'We go to school five days a week.', '我们一周上五天学。'],
      ['weekend', '/ˌwiːkˈend/', '周末', 'Smile', 'We play in the park on weekend.', '我们周末在公园里玩。'],
      ['year', '/jɪə(r)/', '年份/岁', 'Calendar', 'I am six years old.', '我六岁了。'],
      ['yesterday', '/ˈjestədeɪ/', '昨天', 'Calendar', 'Yesterday was a rainy day.', '昨天是一个雨天。']
    ]
  },
  5: {
    transport: [
      ['bicycle', '/ˈbaɪsɪkl/', '自行车', 'Bike', 'I ride my bicycle in the park.', '我在公园里骑自行车。'],
      ['bike', '/baɪk/', '单车/脚踏车', 'Bike', 'My little bike has two training wheels.', '我的小单车有两个辅助轮。'],
      ['boat', '/bəʊt/', '小船', 'Ship', 'We row a little boat on the lake.', '我们在湖上划小船。'],
      ['bus', '/bʌs/', '公共汽车', 'Bus', 'I take the school bus to school.', '我坐校车去上学。'],
      ['car', '/kɑː(r)/', '小汽车', 'Car', 'My father drives a red car.', '我爸爸开一辆红色的汽车。'],
      ['drive', '/draɪv/', '驾车', 'Car', 'Dad learns to drive a car.', '爸爸学开车。'],
      ['driver', '/ˈdraɪvə(r)/', '司机', 'UserCircle', 'The bus driver is very friendly.', '公交车司机非常友好。'],
      ['fly', '/flaɪ/', '飞行', 'Plane', 'Birds can fly high in the sky.', '鸟儿能在天空高高飞翔。'],
      ['helicopter', '/ˈhelɪkɒptə(r)/', '直升机', 'Plane', 'The helicopter lands on the roof.', '直升机停在屋顶上。'],
      ['journey', '/ˈdʒɜːni/', '旅程/行程', 'Map', 'We had a safe journey home.', '我们一路平安到家。'],
      ['lorry', '/ˈlɒri/', '卡车', 'Truck', 'The big lorry carries heavy boxes.', '大货车运送着重盒子。'],
      ['passenger', '/ˈpæsɪndʒə(r)/', '乘客', 'Users', 'The train has many passengers.', '火车上有很多乘客。'],
      ['plane', '/pleɪn/', '飞机', 'Plane', 'The plane flies above the cloud.', '飞机在云朵上方飞。'],
      ['ride', '/raɪd/', '骑乘', 'Bike', 'I can ride a horse.', '我会骑马。'],
      ['road', '/rəʊd/', '马路', 'Car', 'Look left and right before crossing the road.', '过马路前左右看。'],
      ['seat', '/siːt/', '座位', 'Armchair', 'Please take your seat.', '请坐到你的座位上。'],
      ['ship', '/ʃɪp/', '轮船', 'Ship', 'A big white ship is in the ocean.', '海里有一艘白色大轮船。'],
      ['station', '/ˈsteɪʃn/', '车站', 'Train', 'Wait for the train at the station.', '在车站等火车。'],
      ['taxi', '/ˈtæksi/', '出租车', 'Car', 'We take a yellow taxi to the airport.', '我们坐黄色出租车去机场。'],
      ['ticket', '/ˈtɪkɪt/', '票/车票', 'Ticket', 'Buy a ticket before getting on.', '上车前买票。'],
      ['traffic', '/ˈtræfɪk/', '交通', 'Car', 'The city traffic is very busy.', '城市交通非常繁忙。'],
      ['train', '/treɪn/', '火车', 'Train', 'The train runs fast on the track.', '火车在铁轨上跑得很快。'],
      ['travel', '/ˈtrævl/', '旅行', 'Globe', 'We travel to the countryside.', '我们去乡下旅行。'],
      ['trip', '/trɪp/', '短途旅行', 'Luggage', 'We had a school field trip today.', '我们今天学校组织了郊游。']
    ],
    places: [
      ['airport', '/ˈeəpɔːt/', '机场', 'Plane', 'The plane takes off at the airport.', '飞机在机场起飞。'],
      ['bank', '/bæŋk/', '银行', 'Wallet', 'Put your money in the bank.', '把钱存进银行。'],
      ['beach', '/biːtʃ/', '沙滩/海滩', 'Waves', 'I make a sandcastle on the beach.', '我在沙滩上堆沙堡。'],
      ['bridge', '/brɪdʒ/', '桥梁', 'Milestone', 'The train goes over the bridge.', '火车从桥上驶过。'],
      ['building', '/ˈbɪldɪŋ/', '大楼/建筑物', 'Home', 'The school building is high.', '学校大楼很高。'],
      ['cafe', '/ˈkæfeɪ/', '咖啡馆', 'Coffee', 'Mum drinks coffee in the cafe.', '妈妈在咖啡馆喝咖啡。'],
      ['castle', '/ˈkɑːsl/', '城堡', 'Home', 'The prince lives in a stone castle.', '王子住在一座石城堡里。'],
      ['church', '/tʃɜːtʃ/', '教堂', 'Home', 'The bells ring in the church.', '教堂的钟声响起。'],
      ['cinema', '/ˈsɪnəmə/', '电影院', 'Tv', 'We watch cartoons in the cinema.', '我们在电影院看卡通片。'],
      ['city', '/ˈsɪti/', '城市', 'Building2', 'The city has bright lights at night.', '城市的夜里有明亮的灯光。'],
      ['countryside', '/ˈkʌntrisaɪd/', '郊外/乡村', 'TreeDeciduous', 'The air is fresh in the countryside.', '乡下的空气很新鲜。'],
      ['farm', '/fɑːm/', '农场', 'Sprout', 'The farmer works on the farm.', '农夫在农场工作。'],
      ['field', '/fiːld/', '田野', 'Leaf', 'Cows eat grass in the green field.', '牛在绿油油的田野里吃草。'],
      ['forest', '/ˈfɒrɪst/', '森林', 'TreePine', 'Many wild animals live in the forest.', '很多野生动物住在森林里。'],
      ['hospital', '/ˈhɒspɪtl/', '医院', 'Activity', 'The doctor works in the hospital.', '医生在医院工作。'],
      ['hotel', '/həʊˈtel/', '旅馆', 'Hotel', 'We stay in a hotel near beach.', '我们住在海滩附近的旅馆里。'],
      ['island', '/ˈaɪlənd/', '岛屿', 'Waves', 'The island is in the middle of sea.', '那个岛屿在海中央。'],
      ['lake', '/leɪk/', '湖泊', 'Waves', 'The water in the lake is blue.', '湖里的水是蓝色的。'],
      ['market', '/ˈmɑːkɪt/', '市场', 'Store', 'Mother buys fresh fruit at market.', '妈妈在市场买新鲜水果。'],
      ['museum', '/mjuˈziːəm/', '博物馆', 'Building2', 'We see old things in the museum.', '我们在博物馆里看古物。'],
      ['ocean', '/ˈəʊʃn/', '海洋', 'Waves', 'Dolphins live in the deep ocean.', '海豚住在深海里。'],
      ['office', '/ˈɒfɪs/', '办公室', 'Briefcase', 'My dad works in a quiet office.', '我爸爸在一个安静的办公室里工作。'],
      ['park', '/pɑːk/', '公园', 'TreeDeciduous', 'Let\'s fly a kite in the park.', '让我们在公园里放风筝吧。'],
      ['restaurant', '/ˈrestrɒnt/', '饭馆', 'UtensilsCrossed', 'We eat yummy dinner at the restaurant.', '我们在餐厅吃美味的晚餐。'],
      ['river', '/ˈrɪvə(r)/', '河流', 'Waves', 'A long river flows to the sea.', '一条长河经此流向大洋。'],
      ['shop', '/ʃɒp/', '商店', 'Store', 'The toy shop has many bears.', '玩具店里有许多小熊。'],
      ['street', '/striːt/', '街道', 'Car', 'Keep the street clean, do not litter.', '保持街道干净，不要乱扔垃圾。'],
      ['supermarket', '/ˈsuːpəmɑːkɪt/', '超市', 'ShoppingCart', 'Buy some bread in the supermarket.', '在超市买点面包。'],
      ['theatre', '/ˈθɪətə(r)/', '剧院', 'Tv', 'We saw a puppet show at the theatre.', '我们在剧院看木偶剧。'],
      ['zoo', '/zuː/', '动物园', 'Rabbit', 'We see monkeys and lions at the zoo.', '我们在动物园看猴子和狮子。']
    ],
    directions: [
      ['above', '/əˈbʌv/', '在...之上', 'ArrowUp', 'The sky is high above us.', '天空在我们的头顶高处。'],
      ['across', '/əˈkrɒs/', '跨越', 'Milestone', 'Run across the road safely.', '安全地跑过马路。'],
      ['behind', '/bɪˈhaɪnd/', '在...后面', 'UserCircle', 'The mouse hides behind the box.', '老鼠躲在盒子后面。'],
      ['below', '/bɪˈlhəʊ/', '在...下方', 'ArrowDown', 'The fish swims below the boat.', '鱼儿在船的下方游。'],
      ['beside', '/bɪˈsaɪd/', '在...旁边', 'UserCircle', 'Sit beside me on the grass.', '坐在我旁边的草地上。'],
      ['between', '/bɪˈtwiːn/', '在...之间', 'UserCircle', 'The red ball is between two boxes.', '红球在两个盒子中间。'],
      ['centre', '/ˈsentə(r)/', '中心', 'Target', 'Draw a circle in the centre.', '在中心画一个圆。'],
      ['corner', '/ˈkɔːnə(r)/', '角落', 'Milestone', 'Put the toy basket in the corner.', '把玩具篮放在角落里。'],
      ['front', '/frʌnt/', '前面', 'PersonStanding', 'The teacher stands in front of board.', '老师站在黑板前面。'],
      ['inside', '/ɪnˈsaɪd/', '在...里面', 'Home', 'Put the puppy inside the house.', '把小狗放进屋里。'],
      ['left', '/left/', '左边', 'ArrowUp', 'Turn left at the next corner.', '在下一个路口往左拐。'],
      ['middle', '/ˈmɪdl/', '中间', 'Target', 'The sun is in the middle of sky.', '太阳在天空中天。'],
      ['near', '/nɪə(r)/', '临近/近的', 'MapPin', 'Our school is near the park.', '我们的学校在公园附近。'],
      ['north', '/nɔːθ/', '北方', 'Compass', 'The north wind blows cold.', '北风呼呼冷。'],
      ['opposite', '/ˈɒpəzɪt/', '在...对面', 'Milestone', 'The bank is opposite the shop.', '银行在商店对面。'],
      ['outside', '/ˌaʊtˈsaɪd/', '在...外面', 'TreeDeciduous', 'It is sunny, let\'s play outside.', '天晴了，让我们去外面玩。'],
      ['right', '/raɪt/', '右边', 'ArrowUp', 'My right hand holds the pencil.', '我的右手拿着铅笔。'],
      ['south', '/saʊθ/', '南方', 'Compass', 'Birds fly to the south in winter.', '鸟儿冬天飞去南方。'],
      ['under', '/ˈʌndə(r)/', '在...下', 'ArrowDown', 'The cat sleeps under the table.', '小猫在桌子底下睡觉。'],
      ['west', '/west/', '西方', 'Compass', 'The sun sets in the west.', '太阳在西方落下。']
    ]
  },
  6: {
    weather: [
      ['bright', '/braɪt/', '明亮的', 'Sun', 'The morning sun is bright.', '清晨的太阳非常明亮。'],
      ['clear', '/klɪə(r)/', '晴朗的/干净的', 'Cloud', 'The blue sky is clear today.', '今天蓝天非常晴朗。'],
      ['cloud', '/klaʊd/', '云', 'Cloud', 'A soft white cloud is floating.', '一朵软绵绵的白云在漂浮。'],
      ['cloudy', '/ˈklaʊdi/', '多云的', 'Cloud', 'It is cloudy, we cannot see sun.', '多云了，我们看不到太阳。'],
      ['cold', '/kəʊld/', '寒冷的', 'Snowflake', 'Wear gloves, it is cold today.', '戴上手套，今天很冷。'],
      ['dry', '/draɪ/', '干燥的', 'Umbrella', 'Hang the wet clothes to make them dry.', '把湿衣服挂起来晾干。'],
      ['fog', '/fɒɡ/', '雾', 'Cloud', 'The thick fog makes it hard to see.', '浓雾让人很难看清。'],
      ['hot', '/hɒt/', '炎热的', 'Sun', 'It is very hot in summer.', '夏天非常热。'],
      ['ice', '/aɪs/', '冰', 'Snowflake', 'Do not walk on thin lake ice.', '不要在薄冰上走。'],
      ['rain', '/reɪn/', '雨', 'CloudRain', 'The cool rain helps plants grow.', '凉爽的雨水帮助植物生长。'],
      ['rainy', '/ˈreɪni/', '下雨的', 'CloudRain', 'Take an umbrella on a rainy day.', '下雨天带把伞。'],
      ['shine', '/ʃaɪn/', '照耀', 'Sun', 'Stars shine bright at night.', '星星在夜里闪闪发光。'],
      ['snow', '/snəʊ/', '雪', 'CloudSnow', 'The falling snow is beautiful.', '落雪很美丽。'],
      ['snowy', '/ˈsnəʊi/', '下雪的', 'CloudSnow', 'We make a snowman on a snowy day.', '下雪天我们堆雪人。'],
      ['storm', '/stɔːm/', '暴风雨', 'CloudLightning', 'Hear the thunder in the big storm.', '在暴风雨中听见雷声。'],
      ['sun', '/sʌn/', '太阳', 'Sun', 'The warm sun gives us light.', '温暖的太阳带给我们光明。'],
      ['sunny', '/ˈsʌni/', '晴朗的', 'Sun', 'It is a sunny day, let\'s play.', '今天是个晴天，我们去玩吧。'],
      ['wind', '/wɪnd/', '风', 'Wind', 'The strong wind blows my hat off.', '强风把我的帽子吹落了。'],
      ['windy', '/ˈwɪndi/', '刮风的', 'Wind', 'It is windy, fly a kite today.', '今天风大，去放风筝吧。']
    ],
    nature: [
      ['air', '/eə(r)/', '空气', 'Wind', 'We breathe fresh forest air.', '我们呼吸森林里新鲜的空气。'],
      ['branch', '/brɑːntʃ/', '树枝', 'Leaf', 'A little bird sits on the branch.', '一只小鸟停在树枝上。'],
      ['bush', '/bʊʃ/', '灌木丛', 'Leaf', 'The rabbit jumped behind the bush.', '兔子跳到了灌木丛后面。'],
      ['flower', '/ˈflaʊə(r)/', '花朵', 'Flower', 'The red flower has a sweet smell.', '红花有香气。'],
      ['grass', '/ɡrɑːs/', '草地', 'Leaf', 'We sit on the green grass.', '我们坐在绿草地上。'],
      ['ground', '/ɡraʊnd/', '地面', 'Milestone', 'Put the toy basket on the ground.', '把玩具篮子放在地上。'],
      ['hill', '/hɪl/', '山丘', 'Mountain', 'We climb up the little green hill.', '我们爬上绿色小山丘。'],
      ['insect', '/ˈɪnsekt/', '昆虫', 'Bug', 'A little insect walks on the leaf.', '一只小昆虫在叶子上爬。'],
      ['leaf', '/liːf/', '树叶', 'Leaf', 'The green leaf falls in autumn.', '绿叶在秋天落下。'],
      ['mountain', '/ˈmaʊntən/', '大山', 'Mountain', 'The mountain top has white snow.', '大山的山顶上有白雪。'],
      ['plant', '/plɑːnt/', '植物', 'Sprout', 'Water the little plant to help it grow.', '给小植物浇水帮它长大。'],
      ['pond', '/pɒnd/', '池塘', 'Waves', 'Frogs jump in the quiet pond.', '青蛙跳进安静的池塘里。'],
      ['rock', '/rɒk/', '岩石/石头', 'Mountain', 'The big grey rock is hard.', '大灰石头很硬。'],
      ['sky', '/skaɪ/', '天空', 'Cloud', 'We see white clouds in the sky.', '我们在天空里看见白云。'],
      ['star', '/stɑː(r)/', '星星', 'Star', 'The bright star shines at night.', '明亮的星星在夜里发光。'],
      ['stone', '/stəʊn/', '小石头', 'Mountain', 'Throw a little stone in the water.', '向水里扔一块小石头。'],
      ['tree', '/triː/', '树木', 'TreePine', 'The big apple tree is tall.', '大苹果树很高。'],
      ['wave', '/weɪv/', '波浪', 'Waves', 'Ocean waves roll to the beach.', '海浪滚向沙滩。'],
      ['wood', '/wʊd/', '木头/木材', 'TreeDeciduous', 'We build houses with wood.', '我们用木材造房子。']
    ],
    seasons: [
      ['spring', '/sprɪŋ/', '春天', 'Sprout', 'Flowers open in warm spring.', '花儿在温暖的春天开放。'],
      ['summer', '/ˈsʌmə(r)/', '夏天', 'Sun', 'We swim in the lake in summer.', '我们夏天在湖里游泳。'],
      ['autumn', '/ˈɔːtəm/', '秋天', 'Leaf', 'Leaves turn red and gold in autumn.', '树叶在秋天变成红金色。'],
      ['fall', '/fɔːl/', '秋天(美式)', 'Leaf', 'Apples are sweet in the fall.', '秋天的苹果很甜。'],
      ['winter', '/ˈwɪntə(r)/', '冬天', 'Snowflake', 'We wear heavy coats in cold winter.', '我们在寒冷的冬天穿厚大衣。'],
      ['blossom', '/ˈblɒsəm/', '花开/花簇', 'Flower', 'The peach trees are in full blossom.', '桃树正盛开着花。'],
      ['freeze', '/friːz/', '结冰/冻结', 'Snowflake', 'Water will freeze in winter cold.', '水在冬天的寒冷中会结冰。'],
      ['melt', '/melt/', '融化', 'Droplets', 'The warm sun makes snow melt.', '温暖的太阳让雪融化。'],
      ['bloom', '/bluːm/', '开花', 'Flower', 'Roses bloom in the summer heat.', '玫瑰在夏日里盛开。'],
      ['sunrise', '/ˈsʌnraɪz/', '日出', 'Sun', 'Wake up early to watch the sunrise.', '早起看日出。'],
      ['sunset', '/ˈsʌnset/', '日落', 'Sun', 'The evening sky is pink at sunset.', '日落时分晚霞是粉红色的。'],
      ['temperature', '/ˈtemprətʃə(r)/', '温度', 'Thermometer', 'The temperature is cold today.', '今天的温度很冷。']
    ]
  },
  7: {
    sports: [
      ['badminton', '/ˈbædmɪntən/', '羽毛球', 'Trophy', 'We play badminton in the gym.', '我们在体育馆打羽毛球。'],
      ['ball', '/bɔːl/', '球', 'Target', 'Throw the green ball to me, please.', '请把绿球扔给我。'],
      ['baseball', '/ˈbeɪsbɔːl/', '棒球', 'Trophy', 'The boy plays baseball with dad.', '男孩和爸爸打棒球。'],
      ['basketball', '/ˈbɑːskɪtbɔːl/', '篮球', 'Trophy', 'We bounce the basketball.', '我们拍篮球。'],
      ['bat', '/bæt/', '球拍/球棒', 'Milestone', 'He hits the ball with the bat.', '他用球棒击球。'],
      ['beat', '/biːt/', '击败/打败', 'Swords', 'Our team hopes to beat the other team.', '我们的队伍希望能战胜对方。'],
      ['catch', '/kætʃ/', '抓住/接住', 'Hand', 'Can you catch the high ball?', '你能接住高空球吗？'],
      ['champion', '/ˈtʃæmpiən/', '冠军', 'Trophy', 'He is the tennis champion.', '他是网球冠军。'],
      ['climb', '/klaɪm/', '爬山/攀爬', 'Mountain', 'Let\'s climb the green mountain.', '我们爬绿山吧。'],
      ['club', '/klʌb/', '俱乐部', 'Users', 'I go to the junior running club.', '我参加少年跑步俱乐部。'],
      ['coach', '/kəʊtʃ/', '教练', 'UserCircle', 'The football coach teaches us rules.', '足球教练教我们规则。'],
      ['competition', '/ˌkɒmpəˈtɪʃn/', '竞赛', 'Trophy', 'She won a swimming competition.', '她赢得了游泳比赛。'],
      ['cycle', '/ˈsaɪkl/', '骑车/循环', 'Bike', 'I cycle to the park.', '我骑自行车去公园。'],
      ['dive', '/daɪv/', '跳水/潜水', 'Waves', 'Watch the frog dive into the pond.', '看青蛙跳进池塘。'],
      ['exercise', '/ˈeksəsaɪz/', '锻炼/运动', 'Activity', 'Running is good exercise.', '跑步是很好的运动。'],
      ['football', '/ˈfʊtbɔːl/', '足球', 'Trophy', 'We kick the football into the goal.', '我们把足球踢进球门。'],
      ['goal', '/ɡəʊl/', '球门/得分目标', 'Target', 'Tom scored a great goal.', '汤姆进了一个精彩的球。'],
      ['golf', '/ɡɒlf/', '高尔夫球', 'Trophy', 'Grandpa plays golf on weekends.', '爷爷周末打高尔夫球。'],
      ['jump', '/dʒʌmp/', '跳', 'ArrowUp', 'Rabbits can jump very high.', '兔子能跳得很高。'],
      ['kick', '/kɪk/', '踢', 'Footprints', 'Do not kick the ball inside the house.', '不要在屋里踢球。']
    ],
    entertainment: [
      ['actor', '/ˈæktə(r)/', '男演员', 'UserCircle', 'The actor is funny in the cartoon.', '演员在卡通里很有趣。'],
      ['adventure', '/ədˈventʃə(r)/', '冒险', 'Compass', 'Our forest trip was an adventure.', '我们的森林之旅是一次冒险。'],
      ['album', '/ˈælbəm/', '画册/相册/唱片', 'Music', 'I have many photos in the album.', '我相册里有很多照片。'],
      ['art', '/ɑːt/', '艺术/美术', 'Palette', 'The art gallery has pretty paintings.', '美术馆里有许多美丽的画。'],
      ['band', '/bænd/', '乐队', 'Music', 'The music band plays a loud song.', '乐队演奏一首响亮的歌。'],
      ['cartoon', '/kɑːˈtuːn/', '卡通片', 'Tv', 'I watch a dinosaur cartoon on TV.', '我在电视上看恐龙卡通片。'],
      ['cinema', '/ˈsɪnəmə/', '影院', 'Tv', 'Let\'s see a cartoon at the cinema.', '我们在电影院看卡通片吧。'],
      ['comedy', '/ˈkɒmədi/', '喜剧', 'Smile', 'The comedy made the kids laugh.', '喜剧逗得孩子们哈哈大笑。'],
      ['concert', '/ˈkɒnsət/', '音乐会', 'Music', 'My sister sings in the school concert.', '我姐姐在学校音乐会上唱歌。'],
      ['dance', '/dɑːns/', '跳舞', 'Activity', 'The little girl loves to dance.', '小女孩喜欢跳舞。'],
      ['guitar', '/ɡɪˈtɑː(r)/', '吉他', 'Music', 'Dad plays guitar and sings songs.', '爸爸弹吉他唱歌。'],
      ['instrument', '/ˈɪnstrəmənt/', '乐器', 'Music', 'The piano is a beautiful instrument.', '钢琴是一种优美的乐器。'],
      ['movie', '/ˈmuːvi/', '电影', 'Tv', 'We watched a sweet family movie.', '我们看了一部温馨的家庭电影。'],
      ['piano', '/piˈænəʊ/', '钢琴', 'Music', 'She plays piano with her fingers.', '她用手指弹钢琴。'],
      ['song', '/sɒŋ/', '歌曲', 'Music', 'Sing a happy English song together.', '一起唱首快乐的英文歌。']
    ],
    hobbies: [
      ['camp', '/kæmp/', '露营/营地', 'Tent', 'We set up our green tent at the camp.', '我们在营地搭起了绿帐篷。'],
      ['camping', '/ˈkæmpɪŋ/', '露营活动', 'Tent', 'We go camping in the forest.', '我们去森林露营。'],
      ['collect', '/kəˈlekt/', '收集', 'Package', 'I collect colorful stones.', '我收集彩色小石头。'],
      ['cooking', '/ˈkʊkɪŋ/', '烹饪', 'UtensilsCrossed', 'Mother enjoys cooking for us.', '妈妈喜欢为我们做饭。'],
      ['fishing', '/ˈfɪʃɪŋ/', '钓鱼', 'Waves', 'Grandpa takes me fishing at the lake.', '爷爷带我去湖边钓鱼。'],
      ['gardening', '/ˈɡɑːdnɪŋ/', '园艺', 'Flower', 'Gardening makes the flowers beautiful.', '园艺劳动让花儿开得更美。'],
      ['hobby', '/ˈhɒbi/', '爱好', 'Palette', 'My favorite hobby is reading.', '我最喜欢的爱好是阅读。'],
      ['hike', '/haɪk/', '徒步/远足', 'Footprints', 'We hike on the mountain path.', '我们在山路上徒步。'],
      ['outdoor', '/ˈaʊtdɔː(r)/', '户外的', 'TreePine', 'We love outdoor games in the sun.', '我们喜欢在阳光下玩户外游戏。'],
      ['painting', '/ˈpeɪntɪŋ/', '画画/油画', 'Palette', 'The girl hangs her painting on the wall.', '女孩把她的画挂在墙上。']
    ]
  },
  8: {
    emotions: [
      ['afraid', '/əˈfreɪd/', '害怕的', 'AlertTriangle', 'Do not be afraid of the dark.', '不要害怕黑暗。'],
      ['angry', '/ˈæŋɡri/', '生气的', 'Frown', 'Tom was angry when he lost the toy.', '汤姆丢了玩具很生气。'],
      ['bored', '/bɔːd/', '无聊的', 'Meh', 'I feel bored on this rainy afternoon.', '在这个雨天下午我感到很无聊。'],
      ['brave', '/breɪv/', '勇敢的', 'Shield', 'The firefighter is very brave.', '消防员非常勇敢。'],
      ['careful', '/ˈkeəfl/', '小心的', 'Shield', 'Be careful when crossing the street.', '过马路时要小心。'],
      ['cheerful', '/ˈtʃɪəfl/', '快乐开朗的', 'Smile', 'She has a bright, cheerful smile.', '她有灿烂开朗的笑容。'],
      ['excited', '/ɪkˈsaɪtɪd/', '兴奋的', 'Sparkles', 'The kids are excited for the zoo trip.', '孩子们去动物园游玩很兴奋。'],
      ['funny', '/ˈfʌni/', '滑稽有趣的', 'Smile', 'Sparks is a very funny dinosaur.', 'Sparks是一只非常滑稽的恐龙。'],
      ['glad', '/ɡlæd/', '高兴的', 'Smile', 'I am glad to see you today.', '我今天很高兴见到你。'],
      ['happy', '/ˈhæpi/', '快乐的', 'Smile', 'A happy song makes everyone smile.', '一首快乐的歌让每个人微笑。'],
      ['lonely', '/ˈləʊnli/', '孤独的', 'Frown', 'The little puppy felt lonely.', '小狗感到有些孤单。'],
      ['proud', '/praʊd/', '自豪的', 'Trophy', 'Mother is proud of my good work.', '妈妈为我的优秀成果感到自豪。'],
      ['sad', '/sæd/', '难过的', 'Frown', 'Do not feel sad, let\'s play games.', '不要难过，我们来玩游戏吧。'],
      ['sorry', '/ˈsɒri/', '抱歉的', 'HeartHandshake', 'Say sorry when you bump someone.', '撞到别人时要说对不起。'],
      ['surprised', '/səˈpraɪzd/', '惊讶的', 'AlertCircle', 'He was surprised by the gift.', '他被礼物惊喜到了。'],
      ['tired', '/ˈtaɪəd/', '累的/疲倦的', 'Meh', 'I feel tired and want to sleep.', '我累了，想去睡觉。']
    ],
    appearance: [
      ['beautiful', '/ˈbjuːtɪfl/', '漂亮的', 'Sparkles', 'The butterfly has beautiful wings.', '蝴蝶有美丽的翅膀。'],
      ['blonde', '/blɒnd/', '金发的', 'UserCircle', 'The girl has long blonde hair.', '女孩有一头金黄长发。'],
      ['curly', '/ˈkɜːli/', '卷曲的', 'UserCircle', 'My baby sister has curly hair.', '我小妹妹有一头卷发。'],
      ['handsome', '/ˈhænsəm/', '帅气的', 'UserCircle', 'The prince looks handsome.', '王子看起来很帅。'],
      ['medium', '/ˈmiːdiəm/', '中等的', 'Milestone', 'The dog is of medium size.', '这只狗体型中等。'],
      ['pretty', '/ˈprɪti/', '可爱的/漂亮的', 'Sparkles', 'The little flower is very pretty.', '小花非常可爱漂亮。'],
      ['short', '/ʃɔːt/', '矮的/短的', 'UserCircle', 'The small puppy is very short.', '小奶狗非常矮小。'],
      ['slim', '/slɪm/', '苗条的', 'UserCircle', 'She is tall and slim.', '她又高又苗条。'],
      ['tall', '/tɔːl/', '高的', 'Mountain', 'The giraffe is a very tall animal.', '长颈鹿是一种非常高大的动物。'],
      ['thin', '/θɪn/', '瘦的/薄的', 'FileText', 'The white notebook is thin.', '白色的笔记本很薄。'],
      ['young', '/jʌŋ/', '年轻的', 'Baby', 'The young boy can ride a bicycle.', '年轻的小伙子会骑自行车。']
    ],
    personality: [
      ['active', '/ˈæktɪv/', '活跃的', 'Activity', 'The puppy is active and runs fast.', '小狗很活跃，跑得飞快。'],
      ['clever', '/ˈklevə(r)/', '聪明的', 'Brain', 'The clever monkey solves puzzles.', '聪明的猴子会解谜。'],
      ['creative', '/kriˈeɪtɪv/', '有创造力的', 'Palette', 'Art class helps us be creative.', '美术课帮我们发挥创造力。'],
      ['friendly', '/ˈfrendli/', '友好的', 'HeartHandshake', 'Our neighbour is very friendly.', '我们的邻居非常友好。'],
      ['generous', '/ˈdʒenərəs/', '慷慨的', 'Gift', 'The generous boy shares his toys.', '慷慨的男孩分享他的玩具。'],
      ['honest', '/ˈɒnɪst/', '诚实的', 'Shield', 'An honest child does not tell lies.', '诚实的孩子不说谎。'],
      ['lazy', '/ˈleɪzi/', '懒惰的', 'Meh', 'The lazy cat sleeps all day.', '懒猫整天睡觉。'],
      ['nice', '/naɪs/', '好的/和蔼的', 'Smile', 'It is nice to meet you.', '很高兴认识你。'],
      ['patient', '/ˈpeɪʃnt/', '耐心的', 'Shield', 'Our teacher is patient with us.', '老师对我们很有耐心。'],
      ['polite', '/pəˈlaɪt/', '有礼貌的', 'HeartHandshake', 'A polite boy says thank you.', '有礼貌的男孩会说谢谢。'],
      ['popular', '/ˈpɒpjələ(r)/', '受欢迎的', 'Star', 'The book is very popular with kids.', '这本书很受孩子们欢迎。'],
      ['quiet', '/ˈkwaɪət/', '安静的', 'Ear', 'Be quiet in the classroom.', '教室里请保持安静。']
    ]
  },
  9: {
    jobs: [
      ['artist', '/ˈɑːtɪst/', '艺术家', 'Palette', 'The artist paints beautiful views.', '艺术家画美丽的风景。'],
      ['boss', '/bɒs/', '老板', 'Briefcase', 'My father is the boss of a shop.', '我爸爸是一家商店的老板。'],
      ['builder', '/ˈbɪldə(r)/', '建筑工人', 'Home', 'The builder builds stone houses.', '建造工造石头房子。'],
      ['chef', '/ʃef/', '厨师', 'UtensilsCrossed', 'The chef makes delicious soup.', '厨师做美味的汤。'],
      ['cleaner', '/ˈkliːnə(r)/', '保洁员', 'WashingMachine', 'The school cleaner sweeps floor.', '学校保洁员打扫地板。'],
      ['dentist', '/ˈdentɪst/', '牙医', 'Smile', 'The dentist checks my teeth.', '牙医检查我的牙齿。'],
      ['designer', '/dɪˈzaɪnə(r)/', '设计师', 'Palette', 'She is a famous dress designer.', '她是一个著名的服装设计师。'],
      ['doctor', '/ˈdɒktə(r)/', '医生', 'Activity', 'The doctor helps sick people.', '医生帮助生病的人。'],
      ['driver', '/ˈdraɪvə(r)/', '司机', 'Car', 'My uncle is a bus driver.', '我叔叔是公交车司机。'],
      ['engineer', '/ˌendʒɪˈnɪə(r)/', '工程师', 'Briefcase', 'The engineer builds bridges.', '工程师修大桥。'],
      ['farmer', '/ˈfɑːmə(r)/', '农民', 'Sprout', 'The farmer grows sweet apples.', '农民种甜苹果。'],
      ['musician', '/mjuˈzɪʃn/', '音乐家', 'Music', 'The musician plays the violin.', '音乐家拉小提琴。'],
      ['nurse', '/nɜːs/', '护士', 'Activity', 'The kind nurse helps the doctor.', '善良的护士协助医生。'],
      ['pilot', '/ˈpaɪlət/', '飞行员', 'Plane', 'The pilot flies the large plane.', '飞行员驾驶大飞机。'],
      ['scientist', '/ˈsaɪəntɪst/', '科学家', 'FlaskConical', 'The scientist does experiments.', '科学家做科学实验。'],
      ['worker', '/ˈwɜːkə(r)/', '工人', 'Briefcase', 'The worker works in the factory.', '工人在工厂里工作。']
    ],
    shopping: [
      ['bill', '/bɪl/', '账单', 'FileText', 'Please pay the dinner bill.', '请付晚餐账单。'],
      ['buy', '/baɪ/', '购买', 'ShoppingCart', 'I want to buy a new toy train.', '我想买一辆新玩具火车。'],
      ['cash', '/kæʃ/', '现金', 'Wallet', 'I pay with cash at the market.', '我在市场上用现金支付。'],
      ['cheap', '/tʃiːp/', '便宜的', 'CreditCard', 'The small apple is very cheap.', '小苹果非常便宜。'],
      ['coin', '/kɔɪn/', '硬币', 'Coins', 'I put a gold coin in my box.', '我把一枚金币放进盒子里。'],
      ['cost', '/kɒst/', '花费', 'Coins', 'How much does this toy cost?', '这个玩具卖多少钱？'],
      ['customer', '/ˈkʌstəmə(r)/', '顾客', 'Users', 'The shop has many customers.', '商店里有很多顾客。'],
      ['expensive', '/ɪkˈspensɪv/', '昂贵的', 'CreditCard', 'The gold watch is expensive.', '金表很贵。'],
      ['free', '/friː/', '免费的', 'Gift', 'The balloons are free for children.', '气球对儿童免费。'],
      ['price', '/praɪs/', '价格', 'Tag', 'Look at the price on the tag.', '看标签上的价格。'],
      ['sale', '/sel/', '特价/销售', 'Store', 'Toys are on sale this weekend.', '这周末玩具在特价销售。'],
      ['sell', '/sel/', '卖', 'Store', 'They sell delicious bread.', '他们卖好吃的面包。'],
      ['spend', '/spend/', '花费(时间/钱)', 'Clock', 'I spend money on books.', '我花钱买书。']
    ],
    health: [
      ['accident', '/ˈæksɪdənt/', '事故', 'AlertTriangle', 'Drive slowly to avoid accident.', '慢点开以避免事故。'],
      ['ache', '/eɪk/', '疼痛', 'Activity', 'My leg has a little ache.', '我的腿有点疼。'],
      ['cold', '/kəʊld/', '感冒', 'Thermometer', 'I caught a cold in the rain.', '我在雨中淋感冒了。'],
      ['cough', '/kɒf/', '咳嗽', 'Activity', 'Cover your mouth when you cough.', '咳嗽时遮住你的嘴。'],
      ['fever', '/ˈfɪvə(r)/', '发烧', 'Thermometer', 'The doctor checks my high fever.', '医生检查我高烧情况。'],
      ['hospital', '/ˈhɒspɪtl/', '医院', 'Building2', 'The hospital has clean rooms.', '医院有干净的房间。'],
      ['ill', '/ɪl/', '生病的', 'Activity', 'Tom is ill, so he stays in bed.', '汤姆病了，所以他躺在床上。'],
      ['medicine', '/ˈmedsn/', '药', 'FlaskConical', 'Drink this sweet medicine to get well.', '喝点这甜甜的药水，身体就会好起来。'],
      ['pain', '/peɪn/', '疼痛', 'Activity', 'I felt a sharp pain in my foot.', '我感到脚上一阵剧痛。'],
      ['pill', '/pɪl/', '药丸', 'FlaskConical', 'Take the white pill with water.', '配水服下白药丸。'],
      ['safe', '/safe/', '安全的', 'Shield', 'It is safe to cross with dad.', '和爸爸一起过马路是安全的。'],
      ['sick', '/sɪk/', '生病的', 'Activity', 'The sick cat needs a rest.', '生病的猫需要休息。']
    ]
  },
  10: {
    technology: [
      ['app', '/æp/', '应用程序', 'Smartphone', 'Download the English learning app.', '下载这个英语学习应用。'],
      ['browser', '/ˈbraʊzə(r)/', '浏览器', 'Globe', 'Open the browser to search.', '打开浏览器进行搜索。'],
      ['click', '/klɪk/', '点击', 'Target', 'Click the button to hear the sound.', '点击按钮来听声音。'],
      ['computer', '/kəmˈpjuːtə(r)/', '电脑', 'Laptop', 'I play games on the computer.', '我在电脑上玩游戏。'],
      ['data', '/ˈdeɪtə/', '数据', 'FileText', 'Save the research data on the disc.', '把研究数据保存在光盘上。'],
      ['download', '/ˌdaʊnˈləʊd/', '下载', 'ArrowDown', 'Download the audio file, please.', '请下载音频文件。'],
      ['email', '/ˈiːmeɪl/', '电子邮件', 'Mail', 'Send an email to grandma.', '给外婆发一封电子邮件。'],
      ['file', '/faɪl/', '文件', 'FileText', 'The picture file is on the screen.', '图片文件显示在屏幕上。'],
      ['internet', '/ˈɪntənet/', '互联网', 'Wifi', 'We search for stories on the internet.', '我们在互联网上搜故事。'],
      ['keyboard', '/ˈkiːbɔːd/', '键盘', 'Laptop', 'Type your name with the keyboard.', '用键盘打出你的名字。'],
      ['laptop', '/ˈlæptɒp/', '笔记本电脑', 'Laptop', 'Dad works on his laptop.', '爸爸在他的笔记本电脑上工作。'],
      ['password', '/ˈpɑːswɜːd/', '密码', 'Lock', 'Keep your password safe.', '保管好你的密码。'],
      ['screen', '/skriːn/', '屏幕', 'Monitor', 'The computer screen is bright.', '电脑屏幕很亮。'],
      ['search', '/sɜːtʃ/', '搜索', 'HelpCircle', 'Search for KET vocabulary list.', '搜索 KET 词汇表。'],
      ['smartphone', '/ˈsmɑːtfəʊn/', '智能手机', 'Smartphone', 'Mother calls dad with her smartphone.', '妈妈用智能手机给爸爸打电话。'],
      ['software', '/ˈsɒftweə(r)/', '软件', 'Laptop', 'The spelling software is fun.', '拼写软件很有趣。'],
      ['website', '/ˈwebsaɪt/', '网站', 'Globe', 'Visit the school website.', '访问学校网站。'],
      ['wifi', '/ˈwaɪ faɪ/', '无线网络', 'Wifi', 'The hotel room has free wifi.', '旅馆房间里有免费wifi。']
    ],
    communication: [
      ['accept', '/əkˈsept/', '接受', 'HeartHandshake', 'Please accept this little gift.', '请收下这份小礼物。'],
      ['agree', '/əˈɡriː/', '同意', 'ThumbsUp', 'I agree with your suggestion.', '我同意你的建议。'],
      ['answer', '/ˈɑːnsə(r)/', '回答/接电话', 'Phone', 'Please answer the telephone.', '请接电话。'],
      ['ask', '/ɑːsk/', '问', 'HelpCircle', 'Ask the guide for directions.', '向向导问路。'],
      ['call', '/kɔːl/', '打电话/叫喊', 'Phone', 'Call me when you arrive.', '你到了给我打电话。'],
      ['chat', '/tʃæt/', '聊天', 'MessageCircle', 'We chat with Sparks every day.', '我们每天和 Sparks 聊天。'],
      ['complain', '/kəmˈpleɪn/', '抱怨/投诉', 'Frown', 'Do not complain about the food.', '不要抱怨食物。'],
      ['discuss', '/dɪˈskʌs/', '讨论', 'Users', 'Discuss the question with your friend.', '和你的朋友讨论这个问题。'],
      ['explain', '/ɪkˈspleɪn/', '解释', 'Info', 'Teacher explains the hard rule.', '老师解释那个难懂的规则。'],
      ['invite', '/nˈvaɪt/', '邀请', 'Mail', 'Invite them to the birthday party.', '邀请他们来参加生日派对。'],
      ['letter', '/ˈletə(r)/', '信件/字母', 'Mail', 'Write a letter to your cousin.', '写封信给你的表哥。'],
      ['mention', '/ˈmenʃn/', '提到/说起', 'MessageCircle', 'Did she mention the movie name?', '她提到电影的名字了吗？'],
      ['promise', '/ˈprɒmɪs/', '承诺', 'HeartHandshake', 'I promise to finish my homework.', '我承诺做完作业。'],
      ['reply', '/rɪˈplaɪ/', '回复', 'MessageCircle', 'Reply to my message quickly.', '快点回复我的信息。'],
      ['suggest', '/səˈdʒest/', '建议', 'Sparkles', 'I suggest playing outdoor games.', '我建议玩户外游戏。'],
      ['understand', '/ˌʌndəˈstænd/', '理解', 'Brain', 'Do you understand this story?', '你听懂这个故事了吗？']
    ]
  },
  11: {
    countries: [
      ['America', '/əˈmerɪkə/', '美国', 'Globe', 'Washington is the capital of America.', '华盛顿是美国的首都。'],
      ['Australia', '/ɒˈstreɪliə/', '澳大利亚', 'Globe', 'Kangaroos live in Australia.', '袋鼠生活在澳大利亚。'],
      ['Brazil', '/brəˈzɪl/', '巴西', 'Globe', 'Brazil is in South America.', '巴西在南美洲。'],
      ['Canada', '/ˈkænədə/', '加拿大', 'Globe', 'Canada is a very large country.', '加拿大是一个非常大的国家。'],
      ['China', '/ˈtʃaɪnə/', '中国', 'Globe', 'Beijing is the capital of China.', '北京是中国的首都。'],
      ['Chinese', '/ˌtʃaɪˈniːz/', '汉语/中国人', 'Globe', 'I like eating Chinese food.', '我喜欢吃中国菜。'],
      ['England', '/ˈɪŋɡlənd/', '英国/英格兰', 'Globe', 'London is in England.', '伦敦在英格兰。'],
      ['English', '/ˈɪŋɡlɪʃ/', '英语/英国的', 'Globe', 'Speak English with your teacher.', '和老师说英语。'],
      ['France', '/frɑːns/', '法国', 'Globe', 'They travel to France by train.', '他们坐火车去法国。'],
      ['Germany', '/ˈdʒɜːməni/', '德国', 'Globe', 'Berlin is in Germany.', '柏林在德国。'],
      ['India', '/ˈɪndiə/', '印度', 'Globe', 'New Delhi is the capital of India.', '新德里是印度的首都。'],
      ['Italy', '/ˈtʃaɪnə/', '意大利', 'Globe', 'Italy is famous for pizza.', '意大利因比萨饼而闻名。'],
      ['Japan', '/dʒəˈpæn/', '日本', 'Globe', 'Tokyo is the capital of Japan.', '东京是日本的首都。'],
      ['Russia', '/ˈrʌʃə/', '俄罗斯', 'Globe', 'Russia is the largest country.', '俄罗斯是最大的国家。'],
      ['Spain', '/speɪn/', '西班牙', 'Globe', 'Madrid is in Spain.', '马德里在西班牙。'],
      ['capital', '/ˈkæpɪtl/', '首都', 'MapPin', 'What is the capital of France?', '法国的首都是什么？']
    ],
    travel: [
      ['abroad', '/əˈbrɔːd/', '在国外', 'Globe', 'We will travel abroad in summer.', '我们夏天将出国旅行。'],
      ['arrive', '/əˈraɪv/', '到达', 'MapPin', 'We arrive at the airport.', '我们到达了机场。'],
      ['discover', '/dɪˈskʌv(r)/', '发现', 'Compass', 'They discover a hidden path.', '他们发现了一条隐秘的小路。'],
      ['excursion', '/ɪkˈskɜːʃn/', '短途出游', 'Milestone', 'We had a school excursion today.', '我们今天学校组织了短途旅游。'],
      ['explore', '/ɪkˈsplɔː(r)/', '探索', 'Compass', 'Let\'s explore the beautiful forest.', '让我们探索美丽的森林。'],
      ['flight', '/flaɪt/', '航班/飞行', 'Plane', 'Our flight leaves at six.', '我们的航班六点钟起飞。'],
      ['foreign', '/ˈfɒrən/', '外国的', 'Globe', 'He enjoys learning foreign languages.', '他喜欢学习外语。'],
      ['guidebook', '/ˈɡaɪdbʊk/', '旅行指南', 'Book', 'Look at the guidebook for sights.', '看指南了解景点。'],
      ['holiday', '/ˈhɒlədeɪ/', '假期', 'Waves', 'We have a long winter holiday.', '我们有一个长的寒假。'],
      ['luggage', '/ˈlʌɡɪdʒ/', '行李', 'Luggage', 'Put your luggage in the car boot.', '把你的行李放进汽车后备箱。'],
      ['passport', '/ˈpɑːspɔːt/', '护照', 'FileText', 'Do not forget your passport.', '不要忘记你的护照。'],
      ['postcard', '/ˈpəʊstkɑːd/', '明信片', 'FileText', 'Send a postcard from the hotel.', '从旅馆寄一张明信片。'],
      ['sightseeing', '/ˈsaɪtsiːɪŋ/', '观光', 'Camera', 'We go sightseeing in Beijing.', '我们在北京观光。'],
      ['souvenir', '/ˌsuːvəˈnɪə(r)/', '纪念品', 'Gift', 'I bought a souvenir teddy bear.', '我买了一个纪念品泰迪熊。'],
      ['suitcase', '/ˈsuːtkeɪs/', '手提箱', 'Luggage', 'Pack your clothes in the suitcase.', '把你的衣服装入手提箱。'],
      ['tourist', '/ˈtʊərɪst/', '游客', 'Camera', 'The museum has many tourists.', '博物馆里有很多游客。'],
      ['vacation', '/veɪˈkeɪʃn/', '度假/假期', 'Waves', 'We had a nice beach vacation.', '我们度过了一个美好的海滩假期。']
    ],
    accommodation: [
      ['bill', '/bɪl/', '账单', 'Receipt', 'Pay the hotel bill at reception.', '在接待处付旅馆账单。'],
      ['campsite', '/ˈkæmpsaɪt/', '露营地', 'Tent', 'The campsite is near the river.', '营地在河流附近。'],
      ['cancel', '/ˈkænsl/', '取消', 'X', 'Cancel the booking, please.', '请取消预订。'],
      ['check in', '/tʃek ɪn/', '登记入住', 'Hotel', 'We check in at three o\'clock.', '我们三点钟登记入住。'],
      ['check out', '/tʃek aʊt/', '结账退房', 'Hotel', 'Remember to check out before noon.', '记得中午前退房。'],
      ['confirm', '/kənˈfɜːm/', '确认', 'Check', 'Please confirm the hotel room.', '请确认旅馆房间。'],
      ['double', '/ˈdʌbl/', '双人的', 'Users', 'We reserved a double bed room.', '我们预订了一间双人床房。'],
      ['elevator', '/ˈelɪveɪtə(r)/', '电梯', 'Milestone', 'Take the elevator to fifth floor.', '坐电梯去五楼。'],
      ['guest', '/ɡest/', '客人/宾客', 'Users', 'The hotel guest needs help.', '旅馆客人需要帮助。'],
      ['hotel', '/həʊˈtel/', '旅馆/饭店', 'Hotel', 'This hotel is warm and quiet.', '这家旅馆温馨安静。'],
      ['pillow', '/ˈpɪləʊ/', '枕头', 'Bed', 'My bed has a soft pillow.', '我的床有一个软枕头。'],
      ['reception', '/rɪˈsepʃn/', '接待处', 'Milestone', 'Ask for a key at reception.', '在接待处要钥匙。'],
      ['reserve', '/rɪˈzɜːv/', '预订', 'Calendar', 'Reserve a table for dinner, please.', '请预定餐位吃晚餐。'],
      ['single', '/ˈsɪŋɡl/', '单人的', 'UserCircle', 'I booked a single room.', '我预定了一间单人房。']
    ]
  },
  12: {
    phrasal_verbs: [
      ['break down', '/breɪk daʊn/', '出故障', 'AlertTriangle', 'Our car broke down on the road.', '我们的车在路上坏了。'],
      ['carry on', '/ˈkæri ɒn/', '继续', 'ArrowUp', 'Carry on reading the story, please.', '请继续读故事。'],
      ['come back', '/kʌm bæk/', '回来', 'ArrowDown', 'Please come back soon.', '请快点回来。'],
      ['fill in', '/fɪl ɪn/', '填写', 'Pencil', 'Fill in your name on the paper.', '在纸上填上你的名字。'],
      ['find out', '/faɪnd aʊt/', '找出/查明', 'HelpCircle', 'We find out the puzzle answer.', '我们找出了谜题答案。'],
      ['get off', '/ɡet ɒf/', '下车', 'Bus', 'Get off the bus at school station.', '在学校站下公交车。'],
      ['get on', '/ɡet ɒn/', '上车', 'Bus', 'Get on the train quickly.', '快上火车。'],
      ['get up', '/ɡet ʌp/', '起床', 'Sun', 'I get up at seven in morning.', '我早上七点钟起床。'],
      ['give up', '/ɡɪv ʌp/', '放弃', 'Shield', 'Do not give up, keep trying.', '不要放弃，继续努力。'],
      ['grow up', '/ɡrəʊ ʌp/', '长大', 'PersonStanding', 'I want to be a teacher when I grow up.', '我长大后想当一名老师。'],
      ['hurry up', '/ˈhʌri ʌp/', '快点', 'Timer', 'Hurry up, school bus is coming.', '快点，校车来了。'],
      ['look after', '/lʊk ˈɑːftə(r)/', '照顾', 'Heart', 'Mother looks after the little baby.', '妈妈照顾小宝宝。'],
      ['look for', '/lʊk fɔː(r)/', '寻找', 'Search', 'I look for my green pencil.', '我寻找我的绿色铅笔。'],
      ['look up', '/lʊk ʌp/', '查阅/抬头看', 'Search', 'Look up the word in dictionary.', '在字典里查这个词。'],
      ['pick up', '/pɪk ʌp/', '捡起/接人', 'Hand', 'Pick up the toy from floor.', '把玩具从地上捡起来。'],
      ['put on', '/pʊt ɒn/', '穿上', 'Shirt', 'Put on your warm coat.', '穿上你暖和的外套。'],
      ['set off', '/set ɒf/', '出发', 'Compass', 'We set off for park at nine.', '我们九点出发去公园。'],
      ['sit down', '/sɪt daʊn/', '坐下', 'Armchair', 'Sit down and eat breakfast.', '坐下来吃早餐。'],
      ['stand up', '/stænd ʌp/', '站立/起立', 'PersonStanding', 'Please stand up and sing.', '请站起来唱歌。'],
      ['try on', '/traɪ ɒn/', '试穿', 'Shirt', 'Try on the blue shoes, please.', '请试穿这双蓝色的鞋子。'],
      ['turn off', '/tɜːn ɒf/', '关闭', 'Lightbulb', 'Turn off the light when leaving.', '离开时把灯关掉。'],
      ['turn on', '/tɜːn ɒn/', '打开', 'Lightbulb', 'Turn on the desk lamp, please.', '请把台灯打开。'],
      ['wake up', '/weɪk ʌp/', '醒来', 'Sun', 'Wake up, it is a sunny day.', '醒醒，今天是个晴天。']
    ],
    prepositions: [
      ['about', '/əˈbaʊt/', '关于', 'Info', 'Tell me a story about animals.', '给我讲个关于动物的故事。'],
      ['against', '/əˈɡenst/', '反对/靠着', 'Shield', 'Lean the ladder against the wall.', '把梯子靠在墙上。'],
      ['along', '/əˈlɒŋ/', '沿着', 'Milestone', 'Walk along the river bank.', '沿着河岸走。'],
      ['among', '/əˈmʌŋ/', '在...之中', 'Users', 'Find the red ball among toys.', '在玩具中找出红球。'],
      ['around', '/əˈraʊnd/', '围绕/大约', 'Compass', 'Run around the tree branch.', '围着大树跑。'],
      ['before', '/bɪˈfɔː(r)/', '在...之前', 'Calendar', 'Wash hands before eating.', '饭前洗手。'],
      ['behind', '/bɪˈhaɪnd/', '在...后面', 'UserCircle', 'Hide behind the door, please.', '请躲在门后。'],
      ['between', '/bɪˈtwiːn/', '在...之间', 'UserCircle', 'Sit between Mum and Dad.', '坐在爸爸妈妈中间。'],
      ['during', '/ˈdjʊərɪŋ/', '在...期间', 'Clock', 'Do not speak during exam.', '考试期间不要说话。'],
      ['except', '/ɪkˈsept/', '除...之外', 'X', 'Open daily except Sunday.', '每天营业，星期日除外。'],
      ['in front of', '/ɪn frʌnt ɒv/', '在...前方', 'PersonStanding', 'Stand in front of the gate.', '站在大门前面。'],
      ['inside', '/ɪnˈsaɪd/', '在...内', 'Home', 'The bird is inside the cage.', '鸟在鸟笼里。'],
      ['opposite', '/ˈɒpəzɪt/', '对面的', 'Milestone', 'Opposite the bank is the shop.', '银行对面是商店。'],
      ['through', '/θruː/', '穿过', 'Milestone', 'The train goes through tunnel.', '火车穿过隧道。'],
      ['towards', '/təˈwɔːdz/', '朝向', 'Compass', 'Walk towards the warm sun.', '迎着暖阳走去。'],
      ['without', '/wɪˈðaʊt/', '无/没有', 'X', 'Do not leave without saying goodbye.', '走时别忘了说再见。']
    ],
    expressions: [
      ['all right', '/ɔːl raɪt/', '好的/没问题', 'Check', 'Are you all right?', '你没事吧？'],
      ['as well', '/æz wel/', '也/同样', 'Sparkles', 'I want the blue ball as well.', '我也想要那个蓝球。'],
      ['at last', '/æt lɑːst/', '终于', 'Trophy', 'We reached home at last.', '我们终于到家了。'],
      ['for example', '/fər ɪɡˈzɑːmpl/', '例如', 'Info', 'Some fruits, for example, apples.', '有些水果，例如苹果。'],
      ['in the end', '/ɪn ði end/', '最后/终归', 'Trophy', 'We won the game in the end.', '最终我们赢得了比赛。'],
      ['of course', '/ɒv kɔːs/', '当然', 'Check', 'Of course you can play.', '你当然可以玩。'],
      ['on time', '/ɒn taɪm/', '准时', 'Timer', 'The school bus arrived on time.', '校车准时到达。'],
      ['never mind', '/ˈnevə maɪnd/', '没关系', 'HeartHandshake', 'Never mind, let\'s try again.', '没关系，我们再试一次。'],
      ['no problem', '/nəʊ ˈprɒbləm/', '没问题', 'Check', 'Can you help me? No problem.', '你能帮我吗？没问题。'],
      ['well done', '/wel dʌn/', '干得好', 'ThumbsUp', 'You spelled it right, well done!', '你拼写对了，干得好！'],
      ['good luck', '/ɡʊd lʌk/', '祝你好运', 'Sparkles', 'Good luck with your English test.', '祝你英语考试好运。'],
      ['excuse me', '/ɪkˈskjuːz miː/', '打扰一下/劳驾', 'MessageCircle', 'Excuse me, where is the station?', '劳驾，请问车站在哪？'],
      ['you\'re welcome', '/jʊə ˈwelkəm/', '不客气', 'HeartHandshake', 'Thank you! You\'re welcome.', '谢谢！不客气。']
    ],
    actions: [
      ['add', '/æd/', '添加/相加', 'Calculator', 'Add two and three to get five.', '二加上三等于五。'],
      ['allow', '/əˈlaʊ/', '允许', 'Check', 'Mother allows me to watch cartoon.', '妈妈允许我看卡通。'],
      ['appear', '/əˈpɪə(r)/', '出现', 'Sparkles', 'Rainbow appears after the rain.', '雨后彩虹出现。'],
      ['begin', '/bɪˈɡɪn/', '开始', 'Play', 'The lesson begins at eight.', '八点钟开始上课。'],
      ['believe', '/bɪˈliːv/', '相信', 'Shield', 'I believe we can win.', '我相信我们会赢。'],
      ['bring', '/brɪŋ/', '带来', 'Gift', 'Bring your school bag to desk.', '把你的书包拿到课桌来。'],
      ['build', '/bɪld/', '建造', 'Home', 'We build a sandcastle.', '我们建造一个沙堡。'],
      ['change', '/tʃeɪndʒ/', '改变/零钱', 'Coins', 'Weather can change quickly.', '天气可能变化很快。'],
      ['clean', '/kliːn/', '打扫/干净的', 'WashingMachine', 'Clean your desk after school.', '放学后把课桌擦干净。'],
      ['clear', '/klɪə(r)/', '清除/晴朗的', 'Check', 'Clear the plates from table.', '把盘子从桌上收走。'],
      ['contain', '/kənˈteɪn/', '包含/装有', 'Package', 'The box contains many books.', '盒子里装有许多书。'],
      ['create', '/kriˈeɪt/', '创造', 'Palette', 'Create a nice painting.', '创作一幅美丽的画作。'],
      ['decide', '/dɪˈsaɪd/', '决定', 'Target', 'Decide which toy you want.', '决定你想要哪个玩具。'],
      ['enter', '/ˈentə(r)/', '进入', 'DoorOpen', 'Enter the room quietly.', '安静地进入房间。'],
      ['follow', '/ˈfɒləʊ/', '跟随/遵循', 'Footprints', 'Follow the guide path.', '跟着向导的路走。'],
      ['forget', '/fəˈɡet/', '忘记', 'AlertTriangle', 'Do not forget to brush teeth.', '不要忘记刷牙。'],
      ['happen', '/ˈhæpən/', '发生', 'HelpCircle', 'What will happen next?', '接下来会发生什么？'],
      ['improve', '/ɪmˈpruːv/', '提高/改善', 'Trophy', 'Read more to improve vocabulary.', '多读以扩大词汇量。'],
      ['protect', '/prəˈtekt/', '保护', 'Shield', 'A helmet protects your head.', '头盔保护你的头部。'],
      ['receive', '/rɪˈsiːv/', '收到', 'Mail', 'Receive a nice gift from dad.', '收到爸爸送的漂亮礼物。']
    ]
  }
};

// Generate files
Object.keys(levelsData).forEach(lvlStr => {
  const lvl = parseInt(lvlStr, 10);
  const data = levelsData[lvl];
  const formattedWords = [];

  Object.keys(data).forEach(topic => {
    data[topic].forEach(item => {
      const [word, phonetic, translation, icon, sentence, sentenceTranslation] = item;
      const id = `l${lvl}_${word.replace(/\s+/g, '_')}`;
      
      // Determine difficulty & spellingEnabled
      let difficulty = 'basic';
      if (lvl >= 9) difficulty = 'advanced';
      else if (lvl >= 5) difficulty = 'intermediate';

      // spellingEnabled is true for Level 1-6 words with length <= 6 (excluding spaces)
      const spellingEnabled = (lvl <= 6) && (word.replace(/\s+/g, '').length <= 6);

      formattedWords.push({
        id,
        word,
        phonetic,
        translation,
        level: lvl,
        topic,
        icon,
        sentence,
        sentenceTranslation,
        difficulty,
        spellingEnabled
      });
    });
  });

  const fileContent = `// KET Vocabulary Level ${lvl} Data
// Automatically compiled

export const level${lvl}Words = ${JSON.stringify(formattedWords, null, 2)};
`;

  const fileName = `level-${lvl.toString().padStart(2, '0')}.js`;
  fs.writeFileSync(path.join(targetDir, fileName), fileContent, 'utf8');
  console.log(`Successfully generated ${fileName} with ${formattedWords.length} words.`);
});

// Generate entry file index.js
let entryImports = '';
let entryExportArr = [];

for (let lvl = 1; lvl <= 12; lvl++) {
  const pad = lvl.toString().padStart(2, '0');
  entryImports += `import { level${lvl}Words } from './level-${pad}';\n`;
  entryExportArr.push(`...level${lvl}Words`);
}

const indexContent = `// KET Vocabulary Database Main Entry
// Exposes complete curriculum definition

${entryImports}
import { levels, topicCategories } from './levels';

export { levels, topicCategories };

export const allKetWords = [
  ${entryExportArr.join(',\n  ')}
];
`;

fs.writeFileSync(path.join(targetDir, 'index.js'), indexContent, 'utf8');
console.log('Successfully generated index.js');
