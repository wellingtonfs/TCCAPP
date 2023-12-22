import { MobileModel, torch, torchvision, media, Image, ImageUtil } from 'react-native-pytorch-core';
import { ToastAndroid } from 'react-native';

class SynLibras {
    constructor () {
        this.normalize = torchvision.transforms.normalize([0.5, 0.5, 0.5], [0.5, 0.5, 0.5]);
        this.model = null;

        this.loadModel();
    }

    async loadModel() {
        ToastAndroid.show("Carregando modelo...", ToastAndroid.SHORT);

        let mpath = await MobileModel.download(require("../../assets/signlibras_split_pose.pt"));

        this.model = await torch.jit._loadForMobile(mpath);
        console.log("Modelo carregado")

        ToastAndroid.show("Modelo carregado!", ToastAndroid.LONG);
    }

    async test(img) {
        let image = await ImageUtil.fromBundle(img);

        return await ImageUtil.toFile(image);
    }

    async processBundleImage(img, norm = false) {
        let image;

        if (typeof img == "string" && img.startsWith('file://')) {

            image = await ImageUtil.fromFile(img.replace('file://', ''));

        } else {

            image = await ImageUtil.fromBundle(img);

        }

        const blob = media.toBlob(image)

        let tensor = torch.fromBlob(blob, [image.getWidth(), image.getHeight(), 3]);

        tensor = tensor.permute([2, 0, 1]);
        tensor = tensor.div(255);

        if (norm) {
            tensor = this.normalize(tensor);
        }

        tensor = tensor.unsqueeze(0);

        return tensor;
    }

    async processCamImage(img) {
        const blob = media.toBlob(img)

        let tensor = torch.fromBlob(blob, [256, 256, 3]);

    }

    async generate(img, poses) {
        if (this.model == null) {
            return null;
        }

        let imgT = await this.processBundleImage(img, norm = true);

        let poseT = [];

        for (let pose of poses) {
            poseT.push(await this.processBundleImage(pose, norm = false));
        }

        if (imgT == null || poseT.length == 0 || poseT[0] == null) {
            return null;
        }

        const output = await this.model.forward(imgT, ...poseT);

        // desnormalizar

        let tensor = output.squeeze();
        tensor = tensor.mul(255);
        tensor = tensor.to({dtype: torch.uint8});

        return ImageUtil.toFile(media.imageFromTensor(tensor));
    }
}

export default new SynLibras();